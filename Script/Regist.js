let mel = {
	loading: document.getElementById("LOADING"),
	input_field: {
		parent: document.getElementById("INPUTFIELD"),
		passcode: document.getElementById("PASSCODE_INPUT")
	}
};

async function __start() {
	if (!await check()) {
		window.location.href = "/";
		return;
	}

	mel.input_field.passcode.value = "";

	mel.loading.style.display = "none";
	mel.input_field.parent.style.display = "block";
}

function input_check() {
	mel.input_field.passcode.value = mel.input_field.passcode.value.replace(/[^0-9]/g, "").slice(0, 6);

	if (mel.input_field.passcode.value.length == 6) {
		mel.loading.style.display = "block";
		mel.input_field.parent.style.display = "none";
		regist(mel.input_field.passcode.value);
	}
}

async function regist(passcode) {
	const param = new URLSearchParams(window.location.search);
	const session_id = param.get("SESSION");
	const is_public = param.get("TYPE") == "PUBLIC";
	const callback = param.get("CALLBACK");

	let url = "/api/Key/Private";
	if (is_public) url = "/api/Key/Public";

	const ajax = await fetch(url, {
		method: "POST",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"TOKEN": token
		},
		body: JSON.stringify({
			"SESSION": session_id,
			"PASSCODE": passcode
		})
	});
	const result = await ajax.json();
	if (!result.STATUS) {
		alert("エラー！");
	}

	window.location.href = `${callback}?SESSION=${session_id}`;
}