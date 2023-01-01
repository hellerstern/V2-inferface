import { createContext } from "react";

export const TraderProfile = () => {
    getTraderProfile().then((result) => {
        return result;
    });
    return JSON.parse(localStorage.getItem("TraderProfile"));
}

async function getTraderProfile() {
    const profile = localStorage.getItem("TraderProfile") !== null ? JSON.parse(localStorage.getItem("TraderProfile")) : {};
    let isProfileChanged = false;
    if (!profile.username) {
        profile.username = await generateUsername();
        isProfileChanged = true;
    }
    if (!profile.profilePicture) {
        profile.profilePicture = await getRandomCatgirl();
        isProfileChanged = true;
    }
    if (!profile.description) {
        profile.description = "Hi, I am " + profile.username + ".";
        isProfileChanged = true;
    }
    if (isProfileChanged) localStorage.setItem("TraderProfile", JSON.stringify(profile));
    return profile;
}

async function generateUsername() {
    const adjectives = ['adorable', 'beautiful', 'clean', 'drab', 'elegant', 'fancy', 'glamorous', 'handsome', 'long', 'magnificent', 'old-fashioned', 'plain', 'quaint', 'sparkling', 'ugliest', 'unsightly', 'wide-eyed', 'alive', 'better', 'careful', 'clever', 'dead', 'easy', 'famous', 'gifted', 'helpful', 'important', 'inexpensive', 'mushy', 'odd', 'powerful', 'rich', 'shy', 'tender', 'unimportant', 'uninterested', 'vast', 'wrong', 'angry', 'bewildered', 'clumsy', 'defeated', 'embarrassed', 'fierce', 'grumpy', 'helpless', 'itchy', 'jealous', 'lazy', 'mysterious', 'nervous', 'obnoxious', 'panicky', 'repulsive', 'scary', 'thoughtless', 'uptight', 'worried'];
  
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNumber = Math.floor(Math.random() * 10000) + 1;
  
    return adjective + "Trader" + randomNumber.toString();
}

async function getRandomCatgirl() {
    const response = await fetch(`https://www.googleapis.com/customsearch/v1?key=AIzaSyBiPxAr2gmWpR4d9Vxt_tZaeIJf-XH0jn4&cx=e0f354ced324a40e9&q=anime+catgirl+profile+picture&searchType=image&start=${Math.floor(Math.random() * 100)}`);
    const data = await response.json();
    const image = data.items[0];
    return image.link;
  }

export const ProfileContext = createContext();