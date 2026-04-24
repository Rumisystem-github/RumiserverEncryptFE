import { login, get_token } from "./login";
import { setup_start } from "./setup";

export let mel = {
	loading: document.getElementById("LOADING")!,
	ok: document.getElementById("OK")!,
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

	if (setting_check.ED) {
		mel.ok.style.display = "block";
	} else {
		setup_start();
	}
});