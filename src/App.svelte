<script>
	// import "css-doodle";
	import { onMount, afterUpdate } from "svelte";
	import lib from "./data/lib";
	import package_info from "../package.json";
	import Msg from "./page/msg.svelte";
	import Menu from "./page/menu.svelte";
	import Explain from "./addon/explain.svelte";
	import Index from "./page/index.svelte";
	import Foreword from "./page/foreword.svelte";
	import Explore from "./page/explore.svelte";
	import Battle from "./page/battle.svelte";
	import Afflatus from "./page/afflatus.svelte";
	import Reward from "./page/reward.svelte";
	import Epilog from "./page/epilog.svelte";
	import Archive from "./page/archive.svelte";
	import Guide from "./page/guide.svelte";
	import Achievement from "./page/achievement.svelte";
	import Audio from "./addon/audio.svelte";
	import keypress from "./data/keypress";

	import { page, frameEvent, Admin, data, explore, archive } from "./store";

	if (localStorage.getItem("archive") == null)
		localStorage.setItem("archive", JSON.stringify($archive));
	else {
		$archive = JSON.parse(localStorage.getItem("archive"));
		if (!("guide" in $archive)) {
			$archive.guide = {
				menu: true,
				event: true,
				valid_event: true,
				enermy_list: true,
				handcards: true,
				state: true,
				enermy_info: true,
				round_end: true,
				equipment: true,
				win_reward: true,
				get_equipment: true,
				get_souvenir: true,
				get_collection: true,
			};
			localStorage.setItem("archive", JSON.stringify($archive));
		}
	}

	const render = {
		Index,
		Foreword,
		Explore,
		Battle,
		Afflatus,
		Reward,
		Epilog,
		Archive,
	};

	lib();

	frameEvent.set({
		list: {},
		add: function (k, f, t) {
			this.list[k] = {
				handle: f,
				time: t,
				left: t,
				pause: false,
			};
		},
		clear: function (k) {
			if (k) delete this.list[k];
			else this.list = {};
		},
		pause: function (k) {},
	});
	setInterval((_) => {
		let list = $frameEvent.list;
		for (let e in list) {
			if (list[e].left == 1) {
				list[e].left = list[e].time;
				list[e].handle();
			} else list[e].left--;
		}
	}, 16);

	let guide;
	let element_menu;
	let element_root;
	let sUserAgent = navigator.userAgent;
	$Admin.mobile =
		sUserAgent.indexOf("Android") > -1 ||
		sUserAgent.indexOf("iPhone") > -1 ||
		sUserAgent.indexOf("iPad") > -1 ||
		sUserAgent.indexOf("iPod") > -1 ||
		sUserAgent.indexOf("Symbian") > -1;

	onMount(function () {
		if ($Admin.mobile) {
			let percent = document.body.clientWidth / 700;
			$Admin.mobile = percent;
			element_root.style.transform = `rotate(90deg)scale(${percent})`;
			element_root.style.width = `${document.body.clientHeight / percent}px`;
			element_root.style.height = "700px";
			element_root.style.overflow = "visible";
			$frameEvent.add(
				"mobile",
				function () {
					for (let e of document.getElementsByClassName("body")) {
						e.style.width = `${document.body.clientHeight / percent}px`;
					}
				},
				5,
			);
		}
		window.loadFinish = true;
		document.getElementById("blank_source_count").innerText = `同步玩家档案`;
		if (localStorage.getItem("user") != null)
			login(localStorage.getItem("user"));
		else window.loaded();
		keypress.install();
	});
	afterUpdate(function () {
		if (element_menu) {
			element_menu.onclick = $Admin.menu;
			element_menu.ontouchstart = $Admin.menu;
		}
	});

	$Admin.frameEvent = $frameEvent;
	$Admin.data = $data;
	$Admin.save = save;
	$Admin.post = post;
	$Admin.login = login;
	$Admin.user = "";
	$Admin.upload = f => upload($archive, f);
	$Admin.uploadLocal = _ => upload(JSON.parse(localStorage.getItem("archive")));
	window.Admin = $Admin;

	function save() {
		if ($page != "Index") {
			localStorage.setItem("data", JSON.stringify($data));
			localStorage.setItem("explore", JSON.stringify($explore));
		}
	}
	async function encryptReq() {
		let rsa = await KEYUTIL.generateKeypair("RSA", 1024);
		let pub = await KEYUTIL.getPEM(rsa.pubKeyObj);
		sessionStorage.setItem(
			"priv",
			await KEYUTIL.getPEM(rsa.prvKeyObj, "PKCS8PRV"),
		);
		sessionStorage.setItem("pub", pub);
		post("encrypt", { pub }, (res) => console.log(res));
	}
	async function encryptRes() {
		info = info.split("?");
		let aes = await KJUR.crypto.Cipher.decrypt(
			b64tohex(info[0]),
			KEYUTIL.getKey(sessionStorage.getItem("priv")),
		);
		aes = aes.split(",");
		sessionStorage.setItem("key", aes[0]);
		sessionStorage.setItem("iv", aes[1]);
		let bytes = CryptoJS.AES.decrypt(info[1], CryptoJS.enc.Utf8.parse(aes[0]), {
			iv: CryptoJS.enc.Utf8.parse(aes[1]),
		}).toString(CryptoJS.enc.Utf8);
		let data = await JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
		emit("account.autoLog");
	}
	function post(route, info, handle) {
		let data = {
			user: localStorage.getItem("user"),
			info,
		};
		axios({
			method: "post",
			url: `https://ft.api.mafuyu.link${route}`,
			headers: {
				"Content-type": "application/x-www-form-urlencoded",
			},
			data: JSON.stringify(data),
		}).then(function (res) {
			if (res.status == 200) {
				handle && handle(res.data);
			}
		});
	}
	function login(user, handle) {
		post("/user/login", { archive: $archive, user: user }, function (info) {
			["data", "explore", "archive"].forEach((type) => {
				if (info[type]) {
					localStorage.setItem(type, JSON.stringify(info[type]));
				}
			});
			if (info.data) $data = info.data;
			if (info.data) $explore = info.explore;
			if (info.data) $archive = info.archive;
			localStorage.setItem("user", info.user);
			$Admin.user = info.user;
			window.loaded();
			archive.subscribe(upload);// 开启自动同步
			$archive.unlocked.role = ["reimu", "marisa", "alice", "youmu"];
			handle && handle();
		});
	}
	function upload(info, handle) {
		post(
			"/user/upload",
			{ archive: info, explore: $explore, data: $data },
			(res) => {
				if (res.msg != "OK") console.log("同步失败");
				else {
					console.log("uploaded");
					handle && handle();
				}
			},
		);
	}
	function loginOut() {
		localStorage.removeItem("user");
		localStorage.removeItem("archive");
		location.reload();
	}
</script>

<div id="root" bind:this={element_root}>
	<svelte:component this={render[$page]} />
	<Msg />
	<Menu />
	<Explain />
	<Reward />
	<Guide bind:enable={guide} />
	<Achievement />
	{#if ["Afflatus", "Foreword", "Archive"].includes($page)}
		<div class="icon-menu menu_btn" bind:this={element_menu}>
			<span>返回</span>
		</div>
	{/if}
	<txt class="version" on:click={loginOut}>{package_info.version} • {$Admin.user}</txt>
	<Audio />
</div>

<style>
	#root {
		height: 100%;
		width: 100%;
		align-items: center;
		justify-content: center;
		background-size: cover;
		background-position: center;
		overflow: hidden;
		background-color: black;
	}

	.menu_btn {
		position: absolute;
		top: 10px;
		left: 10px;
		font-size: 48px;
		line-height: 48px;
		color: white;
		text-shadow:
			0 0 3px #888,
			0 0 3px #888,
			0 0 3px #888,
			0 0 3px #888,
			0 0 3px #888,
			0 0 3px #888,
			0 0 3px #888;
		z-index: 1000;
		align-items: center;
		flex-direction: row;
		cursor: pointer;
	}
	.menu_btn span {
		font-size: 24px;
		margin-left: 10px;
		margin-bottom: 1px;
		font-family: "title";
	}

	.version {
		color: white;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 1;
		text-shadow:
			0 0 3px #888,
			0 0 3px #888,
			0 0 3px #888,
			0 0 3px #888,
			0 0 3px #888,
			0 0 3px #888,
			0 0 3px #888;
	}
</style>
