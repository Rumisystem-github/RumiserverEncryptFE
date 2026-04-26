import { login, get_token } from "./login";
import { setup_start } from "./setup";

export let mel = {
	loading: document.getElementById("LOADING")!,
	ok: {
		parent: document.getElementById("OK")!,
		input: document.getElementById("OK_INPUT")!
	},
	setup: {
		parent: document.getElementById("SETUP")!,
		first: {
			parent: document.getElementById("SETUP_FIRST")!,
			input: document.getElementById("SETUP_INPUT")! as HTMLInputElement,
			next: document.getElementById("SETUP_NEXT")!,
		},
		check: {
			parent: document.getElementById("SETUP_CHECK")!,
			passcode: document.getElementById("SETUP_PASSCODE")!,
			next: document.getElementById("SETUP_DONE")!
		}
	}
};

window.addEventListener("load", async function(){
	await login("encrypt");

	let ajax = await fetch("/api/Setting", {
		headers: {
			"Accept": "application/json; charset=UTF-8",
			"TOKEN": get_token()
		}
	})
	const setting_check = await ajax.json();
	mel.loading.style.display = "none";

	if (!setting_check.ED) {
		setup_start();
		return;
	}

	mel.ok.parent.style.display = "block";

	/*let checkdata_ajax = await fetch("/api/PrivateKey?NAME=PASSCODE_CHECK", {
		headers: {
			"Accept": "application/json; charset=UTF-8",
			"Content-Type": "application/json; charset=UTF-8",
			"TOKEN": get_token()
		}
	});
	const checkdata_result = await checkdata_ajax.json();
	const key = await get_key("000000", get_self().ID, get_self().REGIST_DATE, base64_decode(setting_check.SALT));
	const data = base64_decode(checkdata_result.KEY);
	const iv = base64_decode(checkdata_result.IV);
	const tag = base64_decode(checkdata_result.TAG);
	const checkdata = await decrypt(key.key, {
		data: data,
		iv: iv,
		tag: tag
	});
	if (new TextDecoder().decode(checkdata) === get_self().ID) {
		
	} else {

	}*/
});

export function passcode_input_event(el: HTMLInputElement) {
	//数字以外を消し飛ばす
	mel.setup.first.input.value = el.value.replace(/\D/g, "");

	//6文字超えたら斬り殺す
	if (el.value.length > 6) el.value = el.value.substring(0, 6);
}