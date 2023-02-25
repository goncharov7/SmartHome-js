"use strict";

let dom = {
    selectbox: document.getElementById('selectbox'),
    selectboxList: document.querySelector('.selectbox__list'),
    rooms: document.getElementById('rooms'),
    settings: document.getElementById('settings'),
    settingsTabs: document.getElementById('settings__tabs'),
    settingsPanels: document.getElementById('settings__panel'),
    temperatureLine: document.getElementById('temperature-line'),
    temperatureRound: document.getElementById('temperature-round'),
    temperature: document.getElementById('temperature'),
    temperatureBtn: document.getElementById('temperature-btn'),
    temperatureSaveBtn: document.getElementById('save-temperature'),
    temperaturePowerBtn: document.getElementById('power'),
    sliders: {
        lights: document.getElementById('lights-slider'),
        humidity: document.getElementById('humidity-slider')
    },
    switch: {
        lights: document.getElementById('lights-power'),
        humidity: document.getElementById('humidity-power')
    }
}

let rooms = {
    all: 'All rooms',
    livingroom: 'Living room',
    bedroom: 'Bedroom',
    kitchen: 'Kitchen',
    bathroom: 'Bathroom',
    studio: 'Studio',
    washingroom: 'Washing room'
}

let activeRoom = 'all';
let activeTab = 'temperature';

// room setting panel
let roomsData = {
    livingroom: {
        temperature: 22,
        temperatureOff: false,
        lights: 70,
        lightsOff: false,
        humidity: 80,
        humidityOff:false
    },
    bedroom: {
        temperature: 22,
        temperatureOff: false,
        lights: 70,
        lightsOff: false,
        humidity: 80,
        humidityOff:false
    },
    kitchen: {
        temperature: 22,
        temperatureOff: false,
        lights: 70,
        lightsOff: false,
        humidity: 80,
        humidityOff:false
    },
    bathroom: {
        temperature: 22,
        temperatureOff: false,
        lights: 70,
        lightsOff: false,
        humidity: 80,
        humidityOff:false
    },
    studio: {
        temperature: 22,
        temperatureOff: false,
        lights: 70,
        lightsOff: false,
        humidity: 80,
        humidityOff:false
    },
    washingroom: {
        temperature: 22,
        temperatureOff: false,
        lights: 70,
        lightsOff: false,
        humidity: 80,
        humidityOff:false
    }
}
//droplist
dom.selectbox.querySelector('.selectbox__selected').onclick = (event) => {
    dom.selectbox.classList.toggle('open');
}
document.body.onclick = (event) => {
    let {target} = event;
    if(!target.matches('.selectbox') && !target.matches('.selectbox__selected') && !target.parentElement.parentElement.matches('.selectbox')){
        dom.selectbox.classList.remove('open');
    }
}
dom.selectboxList.onclick = (event) => {
    let {target} = event;
    if (target.matches('.selectbox__item')){
        let {room} = target.dataset;
        let selectedItem = dom.selectboxList.querySelector('.selected');
        selectedItem.classList.remove('selected');
        target.classList.add('selected');
        dom.selectbox.classList.remove('open');
        selectRoom(room);
    }
}

//func room choose
function selectRoom(room){
    let selectedRoom = dom.rooms.querySelector('.selected');
    if (selectedRoom) {
        selectedRoom.classList.remove('selected');
    }
    if (room !== 'all') {
        let newSelectedRoom = dom.rooms.querySelector(`[data-room=${room}]`);
        let {
            temperature,
            lights,
            humidity,
            lightsOff,
            humidityOff
        } = roomsData[room];
        activeRoom = room;
        newSelectedRoom.classList.add('selected');
        renderScreen(false);

        dom.temperature.innerText = temperature;
        renderTemperature(temperature);
        setTemperaturePower();
        changeSettingsType(activeTab);
        changeSlider(lights, dom.sliders.lights);
        changeSlider(humidity, dom.sliders.humidity);
        changeSwitch('lights', lightsOff);
        changeSwitch('humidity', humidityOff);
    } else {
        renderScreen(true);
    }
    let selectedSelectboxRoom = dom.selectbox.querySelector('.selectbox__item.selected');
    selectedSelectboxRoom.classList.remove('selected');
    let newSelectedItem = dom.selectbox.querySelector(`[data-room =${room}]`);
    newSelectedItem.classList.add('selected');
    let selectboxSelected = dom.selectbox.querySelector('.selectbox__selected span');
    selectboxSelected.innerText = rooms[room];
}

//click on room elem
dom.rooms.querySelectorAll('.room').forEach(room => {
    room.onclick = (event) =>{
        let value= room.dataset.room;
        selectRoom(value);
    }
})

//visible display
function renderScreen(isRooms){
    setTimeout(() => {
        if (isRooms) {
            dom.rooms.style.display = 'grid';
            dom.settings.style.display = 'none';
        } else {
            dom.settings.style.display = 'block';
            dom.rooms.style.display = 'none';
        } 
    }, 300);
}

//render of temperature changes
function renderTemperature(temperature) {
    let min = 16;
    let max = 40;
    let range = max - min;
    let percent = range / 100;
    let lineMin = 54;
    let lineMax = 276;
    let lineRange = lineMax - lineMin;
    let linePercent = lineRange / 100;
    let roundMin = -240;
    let roundMax = 48;
    let roundRange = roundMax - roundMin;
    let roundPercent = roundRange / 100;

    if (temperature >= min && temperature <= max){
        let finishPercent = Math.round((temperature - min) / percent);
        let lineFinishPercent = lineMin + linePercent * finishPercent;
        let roundFinishPercent = roundMin + roundPercent * finishPercent;
        dom.temperatureLine.style.strokeDasharray = `${lineFinishPercent} 276`;
        dom.temperatureRound.style.transform = `rotate(${roundFinishPercent}deg`;
        dom.temperature.innerText = temperature;
    }
}

//changig tmp by mouse
function changeTemperature() {
    let mouseover = false;
    let mousedown = false;
    let position = 0;
    let range = 0;
    let change = 0;
    
    dom.temperatureBtn.onmouseover = () => {
        mouseover = true;
        mousedown = false;
    };
    dom.temperatureBtn.onmouseout = () => mouseover = false;
    dom.temperatureBtn.onmouseup = () => mousedown = false;
    dom.temperatureBtn.onmousedown = (e) =>  {
        mousedown = true;
        position = e.offsetY;
        range = 0;
    }    
    // dom.temperatureBtn.onmouseup = () => mousedown = false;
    dom.temperatureBtn.onmousemove = (e) => {
        if (mouseover && mousedown) {
            range = e.offsetY - position;
            let newChange = Math.round(range / -5);
            if (newChange !== change) {
                let temperature = +dom.temperature.innerText;
                if ( newChange < change) {
                    temperature = temperature - 1;
                } else {
                    temperature = temperature + 1;
                }
                change = newChange;
                renderTemperature(temperature);
            }
        }
    }
}
changeTemperature();

// saving temperature
dom.temperatureSaveBtn.onclick = () => {
    let temperature = +dom.temperature.innerText;
    roomsData[activeRoom].temperature = temperature;
    alert('Temperature saved');
}

///temperature turn off
dom.temperaturePowerBtn.onclick = () => {
    let power = dom.temperaturePowerBtn;
    power.classList.toggle('off');

    if (power.matches('.off')) {
        roomsData[activeRoom].temperatureOff = true;
    } else {
        roomsData[activeRoom].temperatureOff = false;
    }
}
//setting value for power btn temperature
function setTemperaturePower() {
    if (roomsData[activeRoom].temperatureOff) {
        dom.temperaturePowerBtn.classList.add('off');
    } else {
        dom.temperaturePowerBtn.classList.remove('off');
    }
}

//settigns - slider
dom.settingsTabs.querySelectorAll('.tab').forEach((tab) => {
    tab.onclick = () => {
        let optionType = tab.dataset.type;
        activeTab = optionType;
        changeSettingsType(optionType);
    }
});

//change panel settings
function changeSettingsType(type) {
    let tabSelected = dom.settingsTabs.querySelector('.tab.selected');
    let panelSelected = dom.settingsPanels.querySelector('.selected');
    let tab = dom.settingsTabs.querySelector(`[data-type=${type}]`);
    let panel = dom.settingsPanels.querySelector(`[data-type=${type}]`)
    tabSelected.classList.remove('selected');
    panelSelected.classList.remove('selected');
    tab.classList.add('selected');
    panel.classList.add('selected');
}

//function slider of light
function changeSlider(percent, slider) {
    if (percent >= 0 && percent <= 100) {
        let {type} = slider.parentElement.parentElement.dataset;
        slider.querySelector('span').innerText = percent;
        slider.style.height = `${percent}%`;
        roomsData[activeRoom][type] = percent;
    }
}

//watch slider's changes
function watchSlider(slider) {
    let mouseover = false;
    let mousedown = false;
    let position = 0;
    let range = 0;
    let change = 0;
    let parent = slider.parentElement;
    
    parent.onmouseover = () => {
        mouseover = true;
        mousedown = false;
    }
    parent.onmouseout = () => mouseover = false;
    parent.onmouseup = () => mousedown = false;
    parent.onmousedown = (e) =>  {
        mousedown = true;
        position = e.offsetY;
        range = 0;
    }    
    //slider.onmouseup = () => mousedown = false;
    parent.onmousemove = (e) => {
        if (mouseover && mousedown) {
            range = e.offsetY - position;
            let newChange = Math.round(range / -0.25);
            if (newChange !== change) {
                let percent = +slider.querySelector('span').innerText;
                if ( newChange < change) {
                    percent = percent - 1;
                } else {
                    percent = percent + 1;
                }
                change = newChange;
                changeSlider(percent, slider);
            }
        }
    }
}
watchSlider(dom.sliders.lights);
watchSlider(dom.sliders.humidity);

//switch off/on
function changeSwitch(activeTab, isOff) {
    if (isOff) {
        dom.switch[activeTab].classList.add('off');
    } else {
        dom.switch[activeTab].classList.remove('off');
    }
    roomsData[activeRoom][`${activeTab}Off`] = isOff;
}

//click on switchBtn
dom.switch.lights.onclick = () => {
    let isOff = !dom.switch.lights.matches('.off');
    changeSwitch(activeTab, isOff);
}
dom.switch.humidity.onclick = () => {
    let isOff = !dom.switch.humidity.matches('.off');
    changeSwitch(activeTab, isOff);
}