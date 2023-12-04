const apiUrl = 'https://mp3quran.net/api/v3/reciters';
const apiLang = 'ar';

async function getReciters (){
    const chooseReciters = document.querySelector('#chooseReciter');
    const res = await fetch(`${apiUrl}?language=${apiLang}`)
    const data = await res.json()
    chooseReciters.innerHTML = `<option value="">اختار قارئ</option>`
    data.reciters.forEach(element => {
        chooseReciters.innerHTML += `<option value=${element.id}>${element.name}</option>`
    });

    chooseReciters.addEventListener('change', (e) =>getMoshaf(e.target.value));

}

getReciters()

async function getMoshaf(reciter){
    const chooseRewayah = document.querySelector('#chooseRewayah');
    const res = await fetch(`${apiUrl}?language=${apiLang}&reciter=${reciter}`)
    const data = await res.json()
    chooseRewayah.innerHTML= `<option value="" data-server="" data-surahlist=""></option>`                                
    data.reciters[0].moshaf.forEach(moshaf => {
        chooseRewayah.innerHTML += `<option 
                                    value=${moshaf.id}
                                    data-server=${moshaf.server}
                                    data-surahlist=${moshaf.surah_list}
                                     >${moshaf.name}</option>`                                
    });
    chooseRewayah.addEventListener('change', e =>{
        const selectRewayah = chooseRewayah.options[chooseRewayah.selectedIndex]
        const dataServer = selectRewayah.dataset.server;
        const dataSurah = selectRewayah.dataset.surahlist;
        getSurrah(dataServer, dataSurah)
    });

}

async function getSurrah(dataServer, dataSurah){
    const chooseSurah = document.querySelector('#chooseSurah');
    const res = await fetch('https://mp3quran.net/api/v3/suwar?')
    const data = await res.json()
    const surahNames = data.suwar

    dataSurah = dataSurah.split(',')
    chooseSurah.innerHTML = `<option value=""></option>`
    dataSurah.forEach(surah =>{
        const surahPad = surah.padStart(3,'0')
        surahNames.forEach(surahName =>{
            if(surah == surahName.id){
                chooseSurah.innerHTML += `<option value=${dataServer}${surahPad}.mp3>${surahName.name}</option>`
            }
        })
    })
    chooseSurah.addEventListener('change', e =>{
        const selectRewayah = chooseSurah.options[chooseSurah.selectedIndex]
        playSurrah(selectRewayah.value);
    });
}

function playSurrah(surrahMp3){
    const audioPlayer = document.querySelector('#audioPlayer');
    audioPlayer.src = surrahMp3
    audioPlayer.play()
}

function playLive(channel){
    if(Hls.isSupported()){
        var video = document.getElementById('liveVideo');
        var hls = new Hls();
        hls.loadSource(`${channel}`);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function(){
            video.play();
        });
    }
}

// Radio Api:

const radioUrl = 'https://mp3quran.net/api/v3/radios?language=ar';

async function getRadio(){
    const chooseRadio = document.querySelector('#chooseRadio');
    const res = await fetch(`${radioUrl}`);
    const data = await res.json();
    chooseRadio.innerHTML = `<option>اختار الاذاعه</option>`
    data.radios.forEach(radio =>{
        chooseRadio.innerHTML += `<option value='${radio.url}'>${radio.name}</option>`
    });
    chooseRadio.addEventListener('change', e =>{
        const selectRadio = chooseRadio.options[chooseRadio.selectedIndex]
        playRadio(selectRadio.value);
    });
}

getRadio();

function playRadio(radioMp3){
    const radioPlayer = document.querySelector('#radioPlayer');
    radioPlayer.src = radioMp3
    radioPlayer.play()
}