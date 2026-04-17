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

async function __start() {
	if (await check()) {
		mel.ok.style.display = "block";
	} else {
		mel.setup.parent.style.display = "block";
	}

	mel.loading.remove();
}

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

function setup_input_change() {
	mel.setup.first.input.value = mel.setup.first.input.value.replace(/[^0-9]/g, "").slice(0, 6);

	if (mel.setup.first.input.value.length == 6) {
		mel.setup.first.next.removeAttribute("disabled");
	} else {
		mel.setup.first.next.setAttribute("disabled", "");
	}
}

function setup_next() {
	mel.setup.check.passcode.innerText = mel.setup.first.input.value;

	mel.setup.first.parent.style.display = "none";
	mel.setup.check.parent.style.display = "block";
}

async function setup_go() {
	mel.setup.check.parent.style.display = "none";
	mel.setup.loading.parent.style.display = "block";

	await setup(mel.setup.first.input.value);

	window.location.reload();
}