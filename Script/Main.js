let token = null;
let self_user = null;
let mel = {
	loading: document.getElementById("LOADING"),
	ok: document.getElementById("OK"),
	setup: {
		parent: document.getElementById("SETUP"),
		first: {
			parent: document.getElementById("SETUP_FIRST"),
			input: document.getElementById("SETUP_INPUT"),
			next: document.getElementById("SETUP_NEXT")
		},
		check: {
			parent: document.getElementById("SETUP_CHECK"),
			passcode: document.getElementById("SETUP_PASSCODE")
		},
		loading: {
			parent: document.getElementById("SETUP_LOADING")
		}
	}
};

window.addEventListener("load", async function() {
	token = ReadCOOKIE().SESSION;
	if (token == null) {
		window.location.href = "account.rumiserver.com/login?rd=encrypt";
		return;
	}

	self_user = await LOGIN(token);
	if (self_user == false) {
		window.location.href = "account.rumiserver.com/login?rd=encrypt";
		return;
	}

	const ajax = await fetch("/api/Check", {
		method: "GET",
		headers: {
			"Accept": "application/json",
			"TOKEN": token
		}
	});
	const result = await ajax.json();
	if (result.IS_SETUPED) {
		mel.ok.style.display = "block";
	} else {
		mel.setup.parent.style.display = "block";
	}

	mel.loading.remove();
});

async function setup(passcode) {
	const ajax = await fetch("/api/Setup", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json",
			"TOKEN": token
		},
		body: JSON.stringify({
			"PASSCODE": passcode
		})
	});
	const result = await ajax.json();
	console.log(result);
}

async function passcode_check(passcode) {
	const ajax = await fetch("/api/PasscodeCheck", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json",
			"TOKEN": token
		},
		body: JSON.stringify({
			"PASSCODE": passcode
		})
	});
	const result = await ajax.json();
	return result.STATUS;
}