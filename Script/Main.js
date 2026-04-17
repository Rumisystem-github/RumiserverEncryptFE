let token = null;
let self_user = null;

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

	await __start();
});

async function check() {
	const ajax = await fetch("/api/Check", {
		method: "GET",
		headers: {
			"Accept": "application/json",
			"TOKEN": token
		}
	});
	const result = await ajax.json();
	return result.IS_SETUPED;
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
