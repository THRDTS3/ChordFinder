const $ = (id) => document.getElementById(id);
const synth = new Tone.Sampler({
    urls: getURLs(['C4', 'D#4', 'F#4', 'A4', 'C5', 'D#5', 'F#5', 'A5']),
    release: 1,
    baseUrl: "https://tonejs.github.io/audio/salamander/",
}).toDestination();

function getURLs(notes) {
    let obj = {};
    notes.forEach(n => {
        obj[n] = `${n.replace('#', 's')}.mp3`;
    });
    return obj;
}

document.querySelectorAll('button.key').forEach(key => {
    key.onclick = () => {
        if (!key.classList.contains('pressed'))
            synth.triggerAttackRelease(key.getAttribute('note'), '128n');
        key.classList.toggle('pressed');
        let chord = findChord();
        $('chord').textContent = chord?.simple ?? '';
        $('chord-full').textContent = chord?.full ?? '';
    };
});

$('play').onclick = () => {
    synth.triggerAttackRelease(getSelectedNotes(), '4n');

};

$('reset').onclick = () => {
    document.querySelectorAll('button.key.pressed')
        .forEach(x => x.classList.remove('pressed'));
    $('chord').textContent = '';
    $('chord-full').textContent = '';
};

function getPressedKeys() {
    return Array.from(document.querySelectorAll('button.key.pressed'));
}

function getSelectedNotes() {
    return getPressedKeys().map(x => x.getAttribute('note'));
}

function findChord() {
    let elems = getPressedKeys();
    if (elems.length <= 1) return;

    let pressed = elems.map(x => ({
        num: parseInt(x.getAttribute('num')),
        name: x.getAttribute('name')
    }));
    pressed.sort((a, b) => a.num - b.num);

    let root = pressed[0].name;
    let diff = [];
    for (let i = 0; i < pressed.length - 1; i++) {
        diff.push(pressed[i + 1].num - pressed[i].num);
    }

    diff = String(diff).replace(' ', '');
    let sus = getSus(diff);
    if (!sus) return;
    let simple = `${root}${sus[0]}`;
    let full = `${root} ${sus[1]}`;
    return { simple, full };
}

function getSus(diff) {
    switch (diff) {

        case '7': return ['5', 'Harmonic Dyad (Power Chord)'];
        case '4,3': return ['M', 'Major Triad'];
        case '3,4': return ['m', 'Minor Triad'];
        case '4,4': return ['aug', 'Augmented Triad'];
        case '3,3': return ['dim', 'Diminished Triad'];
        case '2,5': return ['sus2', 'Suspended 2nd'];
        case '5,2': return ['sus4', 'Suspended 4th'];

        case '2,2,3': return ['add2', 'Major Triad Add 2'];
        case '2,1,4': return ['madd2', 'Minor Triad Add 2'];
        case '4,1,2': return ['add4', 'Major Triad Add 4'];
        case '3,2,2': return ['madd4', 'Minor Triad Add 4'];
        case '4,3,7': return ['add9', 'Major Triad Add 9'];
        case '3,4,7': return ['madd9', 'Minor Triad Add 9'];

        case '4,3,2': return ['6', 'Major 6th'];
        case '3,4,2': return ['m6', 'Minor 6th'];
        case '3,4,2': return ['m6', 'Minor 6th'];

        case '4,3,3': return ['7', 'Dominant 7th'];
        case '3,4,3': return ['m7', 'Minor 7th'];
        case '4,3,4': return ['M7', 'Major 7th'];
        case '3,4,4': return ['mM7', 'Minor-Major 7th'];
        case '3,3,3': return ['dim7', 'Diminished 7th'];
        case '3,3,5': return ['dimM7', 'Diminished Major 7th'];
        case '3,3,4': return ['m7(b5)', 'Half-Diminished 7th'];
        case '4,4,2': return ['aug7', 'Augmented 7th'];
        case '4,4,3': return ['maj7(#5)', 'Augmented Major 7th'];

        case '2,2,3,3': return ['9', 'Dominant 9th'];
        case '2,1,4,3': return ['m9', 'Minor 9th'];
        case '2,2,3,4': return ['M9', 'Major 9th'];
        case '2,1,4,4': return ['mM9', 'Minor-Major 9th'];
        case '2,1,3,3': return ['dim9', 'Diminished 9th'];
        case '2,1,3,5': return ['dimM9', 'Diminished Major 9th'];
        case '2,2,4,2': return ['aug9', 'Augmented 9th'];
        case '2,2,4,3': return ['augM9', 'Augmented Major 9th'];

        case '2,2,1,2,3': return ['11', 'Dominant 11th'];
        case '2,1,2,2,3': return ['11', 'Minor 11th'];
        case '2,2,1,2,4': return ['M11', 'Major 11th'];
        case '2,1,2,2,4': return ['mM11', 'Minor-Major 11th'];
        case '2,1,2,1,3': return ['dim11', 'Diminished 11th'];
        case '2,1,2,1,5': return ['dimM11', 'Diminished Major 11th'];
        case '2,2,1,3,2': return ['aug11', 'Augmented 11th'];
        case '2,2,1,3,3': return ['augM11', 'Augmented 11th'];
        default: return;
    }
}
