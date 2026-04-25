let token = "none";
let self_user:User;

export type User = {
	
};

export async function login(callback_url:string) {
	read_cookie();

	let ajax = await fetch(`https://account.rumiserver.com/api/Session?ID=${token}`, {
		headers: {
			"Accept": "application/json; charset=UTF-8"
		}
	});
	const result = await ajax.json();
	if (!result.STATUS) {
		window.location.href = `https://account.rumiserver.com/login?rd=${callback_url}`;
		return;
	}

	self_user = result.ACCOUNT_DATA;
}

export function get_token() {
	return token;
}

function read_cookie() {
	const cookie = document.cookie;
	for (const item of cookie.split(";")) {
		const key = item.split("=")[0];
		const value = item.split("=")[1];
		if (key === "SESSION") {
			token = value;
			return;
		}
	}
}