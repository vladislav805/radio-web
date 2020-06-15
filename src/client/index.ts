import apiRequest from './api';
import './main.scss';
import Hls from 'hls.js';
import { dropClassForAllNodes, e, g } from './dom';
import { ICurrentTrack, IStation, IStream } from '../types';
import { renderRow, renderStation, renderStream } from './renders';
import { CLASS_STATION_ACTIVE, CLASS_STREAM_ACTIVE } from './classNames';
import { toTimeFormat } from './utils';

function init() {
	apiRequest('getStations', {
		extended: '1',
	}).then(showStations).catch(e => {
		alert(e);
		console.error('Cannot start get list of radio stations', e);
	});

	initControls();
	initAudio();
}

let wrapContent: HTMLElement;
let nodeHeader: HTMLDivElement;
let nodeControlState: HTMLDivElement;
let nodeMeta: HTMLDivElement;
let nodeTime: HTMLSpanElement;
let nodeDataAmount: HTMLSpanElement;
let nodeImage: HTMLImageElement;
let nodeTrackTitle: HTMLDivElement;
let nodeTrackArtist: HTMLDivElement;

document.addEventListener('DOMContentLoaded', () => {
	wrapContent = g('content');
	nodeHeader = g('header');
	nodeControlState = g('p-control');
	nodeMeta = g('p-meta');
	nodeTime = g('p-time');
	nodeDataAmount = g('p-amount');
	nodeImage = g('p-image');
	nodeTrackTitle = g('p-title');
	nodeTrackArtist = g('p-artist');
	init();
});

const initControls = () => {
	nodeControlState.addEventListener('click', () => {
		const nowPlay = !audioPlayer.paused;

		nowPlay ? audioPlayer.pause() : audioPlayer.play();
		nodeHeader.dataset.playing = String(nowPlay);
	});

	g('p-mute').addEventListener('click', () => {
		audioPlayer.muted = !audioPlayer.muted;
		nodeHeader.dataset.mute = String(audioPlayer.muted);
	});
	//Player.mSettingsButton.addEventListener('click', Player.toggleSettingsList.bind(Player, false));
	nodeImage.addEventListener('click', resolveCurrentTrack);

	toggleLoadingSpinnerState(false);
};

export const toggleLoadingSpinnerState = (state: boolean) => nodeHeader.dataset.loading = String(state);

const pushPage = (node: HTMLElement) => {
	node.classList.add('content__page')
	wrapContent.appendChild(node);

	return () => wrapContent.removeChild(node);
};

const popPage = () => {
	const target: Element = wrapContent.lastElementChild;
	if (!target) {
		return;
	}

	const onAnimationEnd = () => wrapContent.removeChild(target);

	target.addEventListener('animationend', onAnimationEnd);
	target.addEventListener('mozanimationend', onAnimationEnd);
	target.addEventListener('webkitanimationend', onAnimationEnd);
	target.classList.add('content__page__close');
};



const showStations = (stations: IStation[]) => {
	const list = e('div');
	stations.forEach(station => {
		list.appendChild(renderStation(station, {
			onClick: () => showStreams(station),
			currentStation,
		}));
	});

	pushPage(list);
};

const showStreams = (station: IStation) => {
	const list = e('div');
	list.appendChild(renderRow({
		title: 'Назад к станциям',
		info: '',
		onClick: () => popPage(),
	}))
	station.streams.forEach(stream => {
		list.appendChild(renderStream(stream, {
			onClick: () => play(station, stream),
			currentStream,
		}))
	});
	pushPage(list);
};

let audioPlayer: HTMLAudioElement;
let hls: Hls;
let currentStation: IStation = null;
let currentStream: IStream = null;

const initAudio = () => {
	const audio = new Audio();

	audio.addEventListener('timeupdate', onAudioTimeUpdate);
	audio.addEventListener('waiting', onAudioWaiting);
	audio.addEventListener('canplay', onAudioCanPlay);
	audio.addEventListener('playing', onAudioStateChange);
	audio.addEventListener('pause', onAudioStateChange);
	/*audio.addEventListener('error')
	audio.addEventListener('progress');*/

	audioPlayer = audio;
};

const onAudioTimeUpdate = () => {
	let loadedSeconds = audioPlayer.seekable.length
		? audioPlayer.seekable.end(0)
		: 0;

	if (loadedSeconds === Infinity) {
		loadedSeconds = audioPlayer.currentTime;
	}

	const dataAmount = loadedSeconds * currentStream?.bitrate / 8;
	nodeDataAmount.textContent = dataAmount > 1024
		? (dataAmount / 1024).toFixed(2) + 'MB'
		: dataAmount.toFixed(1) + 'KB';

	nodeTime.textContent = toTimeFormat(audioPlayer.currentTime);
};

const onAudioWaiting = () => toggleLoadingSpinnerState(true);
const onAudioCanPlay = () => toggleLoadingSpinnerState(false);

const onAudioStateChange = () => {
	nodeControlState.dataset.playing = String(!audioPlayer.paused);
};

const play = (station: IStation, stream: IStream) => {
	dropClassForAllNodes(CLASS_STATION_ACTIVE);
	dropClassForAllNodes(CLASS_STREAM_ACTIVE);

	document.querySelector(`[data-station-id="${station.stationId}"]`)?.classList.add(CLASS_STATION_ACTIVE);
	document.querySelector(`[data-stream-id="${stream.streamId}"]`)?.classList.add(CLASS_STREAM_ACTIVE);

	if (hls) {
		hls.destroy();
		hls = null;
	}

	let url = stream.url;

	if (stream.secure && url.startsWith('http:')) {
		url = url.replace('http:', 'https:');
	}

	currentStation = station;
	currentStream = stream;

	setCurrentTrack(null);

	if (stream.format === 'm3u8') {
		if (Hls.isSupported()) {
			hls = new Hls();
			hls.loadSource(stream.url);
			hls.attachMedia(audioPlayer);

			//noinspection JSUnresolvedVariable
			hls.on(Hls.Events.MANIFEST_PARSED, () => audioPlayer.play());
		} else {
			alert('HLS are not supported by your browser');
		}
	} else {
		audioPlayer.src = url;

		// noinspection JSIgnoredPromiseFromCall
		audioPlayer.play();
	}
};



const resolveCurrentTrack = () => {
	if (!currentStream) {
		return;
	}

	apiRequest<ICurrentTrack>('getCurrentTrack', {
		streamId: String(currentStream.streamId)
	}).then(setCurrentTrack);
};

const setCurrentTrack = (track: ICurrentTrack) => {
	if (!track) {
		track = {
			artist: `${currentStream.cityTitle}, ${currentStream.format}, ${currentStream.bitrate} kbps`,
			title: currentStation.title,
		};
	}

	nodeTrackArtist.textContent = track.artist;
	nodeTrackTitle.textContent = track.title;
	nodeImage.src = track.image || nodeImage.dataset.defaultImage;
};








/*
const Radio = {
	mItems: null,
	mCities: null,
	mACities: null,
	mStationInCity: {},
	mPlayer: null,
};

const Player = {

	mAudio: null,

	mStation: null,
	mStream: null,

	mControl: null,
	mMute: null,
	mTrackable: null,
	mMeta: null,
	mTime: null,
	mAmount: null,
	mArtist: null,
	mTitle: null,
	mCover: null,

	mBitrate: null,
	mBitrateValue: null,
	mBitrateList: null,

	mSettings: null,

	mSettingsButton: null,
	mSettingsBlock: null,

	mTimeStartup: 0,

	mTrackUpdateInterval: null,

	mLoadedSeconds: 0,

	init() {
		Player.mAudio = new Audio();

		Player.mControl = g("p-control");
		Player.mMute = g("p-mute");
		Player.mMeta = g("p-meta");
		Player.mTime = g("p-time");
		Player.mAmount = g("p-amount");
		Player.mArtist = g("p-artist");
		Player.mTitle = g("p-title");
		Player.mCover = g("p-image");

		Player.mBitrate = g("p-bitrate");
		Player.mBitrateValue = g("p-bitrate-value");
		Player.mBitrateList = g("p-bitrate-list");

		Player.mSettingsButton = g("p-settings-button");
		Player.mSettingsBlock = g("p-settings");

		Player.initAudio();
		Player.initControls();
		Player.initTrackInterval();
		Player.initSettings();

		return Player;
	},

	initAudio() {
		Player.mAudio.addEventListener("error", Player.onError.bind(Player));
		Player.mAudio.addEventListener("progress", Player.onProgress.bind(Player));
		window.addEventListener("online", Player.onOnline.bind(Player));
	},

	onProgress() {
		Player.__setAmount();
		Player.updateLabel();
	},




	onError() {
		Player.__restart();
	},

	onOnline() {
		Player.__restart();
	},

	__restart() {
		if (Player.mSettings.get(SettingsKey.ON_ERROR_CONTINUE) && Player.mAudio && Player.mAudio.src) {
			//noinspection SillyAssignmentJS
			Player.mAudio.src = Player.mAudio.src;
			Player.mAudio.play();
		}
	},

	__setAmount() {
		Player.mLoadedSeconds = Player.mAudio.seekable.length ? Player.mAudio.seekable.end(0) : 0;
	},

	initTrackInterval(expiresIn = 0) {
		Player.clearTrackInterval();
		Player.mTrackUpdateInterval = setTimeout(Player.resolveTrack.bind(Player), expiresIn * 1000);
		console.info("Next check in " + (expiresIn * 1000) + " seconds");
	},

	initSettings() {
		Player.mSettings = Settings.load();
		Player.mSettings.setValuesInUI(Object.values(SettingsKey));
	},

	clearTrackInterval() {
		clearTimeout(Player.mTrackUpdateInterval);
		Player.mTrackUpdateInterval = 0;
	},

	setMute() {
		var willMute = !Player.mAudio.muted;

		Player.mMute.classList.remove(willMute ? "icon-mute-0" : "icon-mute-1");
		Player.mMute.classList.add(willMute ? "icon-mute-1" : "icon-mute-0");
		Player.mAudio.muted = willMute;
	},

	setCurrent(station) {
		Player.mStation = station;
		const stream = Player.getAvailablePreferredQuality(station.streams);
		Player.setFile(station, stream);
		Player.setBitrateList(station.streams);
		Player.setTrackable(station, station.streams[stream]);
	},

	setTrack(track) {
		if (!track) {
			track = { _noContinue: true };
		}
		Player.mTitle.textContent = track.title ? (track.title) : Player.mStation.title;
		Player.mArtist.textContent = track.artist ? (track.artist) : "No data";
		Player.mCover.src = track.image ? track.image : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E";

		setDocumentTitle(Player.mStation.title + " | " + (track.title ? (track.artist || "") + " - " + (track.title) : ""));

		if (!track._noContinue && Player.mSettings.get(SettingsKey.AUTO_RESOLVE_TRACK)) {
			Player.initTrackInterval(track.expiresIn);
		}
	},

	CLASS_ITEM_LIST_ACTIVE: "listItem-active",

	CLASS_BITRATE_LIST_OPENED: "p-bitrate-list-opened",
	CLASS_SETTINGS_LIST_OPENED: "settings-opened",

	setTrackable(station, stream) {
		const stationInfo = Radio.mStationInCity[station.stationId + '_' + stream.cityId];

		Player.clearTrackInterval();
		if (stationInfo && stationInfo.canRecognizeTrack && Player.mSettings.get(SettingsKey.AUTO_RESOLVE_TRACK)) {
			Player.resolveTrack();
		} else {
			Player.setTrack({});
		}
	},

	resetCounter() {
		Player.mTimeStartup = Date.now();
	},

	resolveTrack() {
		if (!Player.mStation || Player.mStation && !Player.mStation.canRecognizeTrack) {
			return;
		}

		Player.setLoading(true);
		vlad805.api.radio.getCurrentBroadcastingTrack(Player.mStation.stationId).then(track => {
			Player.setLoading(false);
			Player.setTrack(track);
		}).catch(e => {
			Player.setLoading(false);
			console.log("API Error: ", e);
		});
	},

	toggleSettingsList(forceClose) {
		var opened = Player.mSettingsBlock.classList.contains(Player.CLASS_SETTINGS_LIST_OPENED);
		if (opened || forceClose) {
			Player.mSettingsBlock.classList.remove(Player.CLASS_SETTINGS_LIST_OPENED);
			//this.mSettingsBlock.style.height = "0";
		} else {
			Player.mSettingsBlock.classList.add(Player.CLASS_SETTINGS_LIST_OPENED);
			//this.mSettingsBlock.style.height = (36 * this.mSettingsBlock.children.length) + "px";
		}
	},


};

function openContextMenu(x, y, station) {
	var prev = document.querySelector(".contextMenu-wrap");
	if (prev) {
		prev.parentNode.removeChild(prev);
	}

	var styles = "top: " + y + "px; left: " + x + "px",

	children = [],
	wrap,
	listener = function() {
		setTimeout(wrap.parentNode.removeChild.bind(wrap.parentNode, wrap), 10);
	},

	item = function(label, handler) {
		return e("div", {"class": "contextMenu-item"}, {click: function() {
			handler();
		}}, label);
	};

	children.push(item("Copy link to this station", function() {
		setTextClipboard("https://radio.vlad805.ru/s/" + station.stationId);
	}));

	children.push(item("Copy internal station ID", function() {
		setTextClipboard(String(station.stationId));
	}));

	if (station.domain) {
		children.push(item("Open official site of station", function() {
			window.open("http://" + station.domain + "/");
		}));
	}

	getBody().appendChild(wrap = e("div", { "class": "contextMenu-wrap", style: styles }, null, children));
	getBody().addEventListener("click", listener, false);
}


const Settings = {

	mBundle: {},

	load: function() {
		Settings.keys().forEach(function(key) {
			var val = localStorage.getItem(key);

			//noinspection JSCheckFunctionSignatures
			if (!isNaN(val)) {
				val = +val;
			}

			if (val === "true" || val === "false") {
				val = val === "true";
			}

			Settings.mBundle[key] = val;
		}, Settings);
		return Settings;
	},

	get: function(key) {
		return Settings.mBundle[key];
	},

	set: function(key, value) {
		localStorage.setItem(key, value);
		Settings.mBundle[key] = value;
		return Settings;
	},

	keys: function() {
		var data = [];
		for (var i = 0, l = localStorage.length; i < l; ++i) {
			data.push(localStorage.key(i));
		}
		return data;
	},

	onChange: function(node) {
		var val;
		if (!node) { return } // sony
		switch (node.tagName.toLowerCase()) {
			case "input":
				val = node.type === "checkbox" || node.type === "radio" ? node.checked : node.value;
				break;

			case "select":
				val = node.options[node.selectedIndex].value;
				break;

			default:
				return;

		}

		Settings.set(node.name, val);
	},

	setValuesInUI: function(items) {
		items.forEach(function(item) {
			var nodes = document.getElementsByName(item), value = Settings.get(item);

			//noinspection JSValidateTypes
			var node = nodes[0];

			if (!node) { return; }

			switch (node.tagName.toLowerCase()) {
				case "input":
					if (node.type === "checkbox" || node.type === "radio") {
						node.checked = !!value;
					} else {
						node.value = value;
					}
					break;

				case "select":
					for (var i = 0, l; (l = node.options[i]); ++i) {
						if (l.value === value) {
							node.selectedIndex = i;
							break;
						}
					}
					break;

				default:
					return;

			}
		}, Settings);
	}

};


const SettingsKey = {
	ON_ERROR_CONTINUE: "on-error-continue",
	PREFERRED_QUALITY: "preferred-quality",
	AUTO_RESOLVE_TRACK: "auto-resolve-track"
};*/







