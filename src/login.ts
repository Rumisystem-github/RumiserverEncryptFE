let token = "none";
let self_user:User;

export type User = {
	ID: string,
	UID: string,
	REGIST_DATE: Date
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

	self_user = {
		ID: result.ACCOUNT_DATA.ID,
		UID: result.ACCOUNT_DATA.UID,
		REGIST_DATE: new Date(result.ACCOUNT_DATA.REGIST_DATE)
	};
}

export function get_token(): string {
	return token;
}

export function get_self(): User {
	return self_user;
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