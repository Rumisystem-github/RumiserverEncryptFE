import { encrypt, gen_salt, get_key } from "./key";
import { get_self, get_token } from "./login";
import { mel } from "./main";

export function setup_start() {
	//初期化
	mel.setup.first.input.value = "";
	mel.setup.first.next.setAttribute("disabled", "");

	//表示
	mel.setup.parent.style.display = "block";

	//最初のページ/入力欄への入力時の動作
	mel.setup.first.input.onkeyup = function() {
		const value = mel.setup.first.input.value;

		//数字以外を消し飛ばす
		mel.setup.first.input.value = value.replace(/\D/g, "");

		//6文字超えたら斬り殺す
		if (value.length > 6) mel.setup.first.input.value = value.substring(0, 6);

		if (value.length === 6) {
			//6文字なので次へ行ける
			mel.setup.first.next.removeAttribute("disabled");
		} else {
			//6文字じゃないので無理
			mel.setup.first.next.setAttribute("disabled", "");
		}
	};

	//最初のページ/次へボタン
	mel.setup.first.next.onclick = function() {
		mel.setup.first.parent.style.display = "none";
		mel.setup.check.parent.style.display = "block";
		mel.setup.check.passcode.innerText = mel.setup.first.input.value;
	};

	//チェックページ/次へボタン
	mel.setup.check.next.onclick = async function() {
		//ロード中
		mel.setup.check.parent.style.display = "none";
		mel.loading.style.display = "block";

		const passcode = mel.setup.first.input.value;
		const passphrase = `${passcode}${get_self().ID}${Math.floor(get_self().REGIST_DATE.getTime() / 1000)}`;
		const key = await get_key(passphrase, gen_salt());

		//登録
		let regist_ajax = await fetch("/api/Setting", {
			method: "POST",
			headers: {
				"Accept": "application/json; charset=UTF-8",
				"Content-Type": "application/json; charset=UTF-8",
				"TOKEN": get_token()
			},
			body: JSON.stringify({
				"KDF": "ARGON2ID",
				"SALT": btoa(String.fromCharCode(...key.salt))
			})
		});
		const regist_result = await regist_ajax.json();
		if (!regist_result.STATUS) throw new Error("エラー");
		window.location.reload();
	}
}