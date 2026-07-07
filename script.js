let sounds = [];

let soundFiles = {};

let running = false;
const timers = [];

const soundList = document.getElementById("sound-list");
const toggleBtn = document.getElementById("toggleBtn");
loadSoundPack();




async function loadSoundPack() {

    const request =
        indexedDB.open("SoundMachine", 2);


    request.onsuccess = async event => {

        const db =
            event.target.result;

        const transaction =
            db.transaction(
                "pack",
                "readonly"
            );


        const store =
            transaction.objectStore("pack");


        const jsonText =
            await getValue(store, "list");


        const zipBuffer =
            await getValue(store, "zip");


        const config =
            JSON.parse(jsonText);


        sounds =
            config.sounds;


        if (zipBuffer) {

            await loadZip(zipBuffer);

        } else {

            console.log("No local sound pack needed.");

        }

        createSoundControls();

    };

}


function getValue(store, key) {

    return new Promise(resolve => {

        const request =
            store.get(key);


        request.onsuccess = () => {

            resolve(request.result);

        };

    });

}

async function loadZip(zipBuffer) {

    const zip =
        await JSZip.loadAsync(zipBuffer);


    for (const file of Object.values(soundFiles)) {

        URL.revokeObjectURL(file);

    }

    soundFiles = {};


    for (const filename of Object.keys(zip.files)) {

        const entry =
            zip.files[filename];


        if (!entry.dir) {

            const blob =
                await entry.async("blob");


            soundFiles[filename] =
                URL.createObjectURL(blob);

        }

    }



}
function createSoundControls() {

    soundList.innerHTML = "";

    sounds.forEach(sound => {

        sound.playing = false;

        const row = document.createElement("div");
        row.className = "sound-item";

        row.innerHTML = `
            <input type="checkbox" id="${sound.id}">
            <label for="${sound.id}">${sound.name}</label>

            <input
                type="range"
                id="${sound.id}Rate"
                min="10"
                max="300"
                step="10"
                value="${sound.defaultRate}">

            <span
                id="${sound.id}RateValue"
                class="frequency">
                ${sound.defaultRate}s
            </span>
        `;

        soundList.appendChild(row);


        const checkbox = document.getElementById(sound.id);

        checkbox.addEventListener("change", () => {

            if (checkbox.checked) {

                playSound(sound, true);

            }

        });

    });


    setupSliders();


    const volumeSlider =
        document.getElementById("masterVolume");

    const volumeLabel =
        document.getElementById("masterVolumeValue");


    if (volumeSlider && volumeLabel) {

        volumeLabel.textContent =
            volumeSlider.value + "%";


        volumeSlider.addEventListener("input", () => {

            volumeLabel.textContent =
                volumeSlider.value + "%";

        });

    }

}



function setupSliders() {

    document
    .querySelectorAll('input[type="range"]')
    .forEach(slider => {


        const value =
            document.getElementById(
                slider.id + "Value"
            );


        if (!value) return;


        const unit =
            slider.id === "masterVolume"
            ? "%"
            : "s";


        function update() {

            value.textContent =
                slider.value + unit;

        }


        slider.addEventListener(
            "input",
            update
        );


        update();


    });

}



function playSound(sound, preview = false) {


    if (!preview && sound.playing) return;


    if (!preview) {

        sound.playing = true;

    }


    let file;
    let playMode;



    // GROUP SOUND

    if (sound.type === "group") {


        playMode = sound.mode;



        // Custom file list

        if (sound.files) {


            const keys =
                Object.keys(sound.files);


            const randomKey =
                keys[
                    Math.floor(
                        Math.random() * keys.length
                    )
                ];


            file =
                sound.files[randomKey];


        }



        // Automatic numbered folder

        else {


            const number =
                Math.floor(
                    Math.random() * sound.count
                );


            const digits =
                sound.digits || 2;


            const extension =
                sound.extension || "mp3";


            file =
    sound.folder +
    number
    .toString()
    .padStart(digits, "0") +
    "." +
    extension;


file =
    soundFiles[file]
    || file;


        }


    }



    // SINGLE SOUND

    else {

    file =
        soundFiles[sound.file]
        || sound.file;

    playMode =
        sound.mode;

    }



    const audio =
        new Audio(file);



    const volumeSlider =
        document.getElementById(
            "masterVolume"
        );


    if (volumeSlider) {

        audio.volume =
            volumeSlider.value / 100;

    }



    audio.onerror = () => {


        console.error(
            "Could not load:",
            file
        );


        if (!preview) {

            sound.playing = false;

        }

    };



    audio.addEventListener(
        "loadedmetadata",
        () => {



        if (playMode === "short") {


            audio.play();



            audio.onended = () => {

                if (!preview) {

                    sound.playing = false;

                }

            };



        }



        else if (playMode === "long") {



            const segmentLength = 5;



            const maxStart =
                Math.max(
                    0,
                    audio.duration -
                    segmentLength
                );



            audio.currentTime =
                Math.random() * maxStart;



            audio.play();



            setTimeout(() => {


                audio.pause();



                if (!preview) {

                    sound.playing = false;

                }


            }, segmentLength * 1000);



        }



    });



}



function scheduleSound(sound) {


    function scheduleNext() {


        if (!running) return;



        const checkbox =
            document.getElementById(sound.id);



        if (checkbox.checked) {

            playSound(sound);

        }



        const average =
            Number(
                document.getElementById(
                    sound.id + "Rate"
                ).value
            );



        const deviation = 5;



        const delay =
            Math.max(
                1000,
                (
                    average +
                    (Math.random() * 2 - 1)
                    * deviation
                ) * 1000
            );



        timers.push(
            setTimeout(
                scheduleNext,
                delay
            )
        );


    }



    const average =
        Number(
            document.getElementById(
                sound.id + "Rate"
            ).value
        );



    timers.push(

        setTimeout(
            scheduleNext,
            Math.random() *
            average *
            1000
        )

    );


}




toggleBtn.onclick = () => {


    if (running) {

        stopGenerator();

    }

    else {

        startGenerator();

    }


};




function startGenerator() {


    running = true;


    toggleBtn.textContent =
        "Stop Generator";


    toggleBtn.classList.add(
        "running"
    );



    sounds.forEach(
        scheduleSound
    );


}




function stopGenerator() {


    running = false;



    toggleBtn.textContent =
        "Start Generator";



    toggleBtn.classList.remove(
        "running"
    );



    timers.forEach(
        clearTimeout
    );



    timers.length = 0;



    sounds.forEach(sound => {


        sound.playing = false;


    });


}
