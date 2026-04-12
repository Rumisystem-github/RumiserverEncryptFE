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