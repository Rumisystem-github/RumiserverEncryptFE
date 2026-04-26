import { encrypt, gen_salt, get_key } from "./key";
import { get_self, get_token } from "./login";
import { mel, passcode_input_event } from "./main";

export function setup_start() {
	//初期化
	mel.setup.first.input.value = "";
	mel.setup.first.next.setAttribute("disabled", "");

	//表示
	mel.setup.parent.style.display = "block";

	//最初のページ/入力欄への入力時の動作
	mel.setup.first.input.onkeyup = function() {
		passcode_input_event(mel.setup.first.input);
		if (mel.setup.first.input.value.length === 6) {
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
		const key = await get_key(passcode, get_self().ID, get_self().REGIST_DATE, gen_salt());

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

		//パスコードチェック用データを登録
		const checkdata_encrypt = await encrypt(key.key, new TextEncoder().encode(get_self().ID));
		let checkdata_ajax = await fetch("/api/PrivateKey", {
			method: "POST",
			headers: {
				"Accept": "application/json; charset=UTF-8",
				"Content-Type": "application/json; charset=UTF-8",
				"TOKEN": get_token()
			},
			body: JSON.stringify({
				"NAME": "PASSCODE_CHECK",
				"TYPE": "AES-GCM",
				"KEY": btoa(String.fromCharCode(...checkdata_encrypt.data)),
				"IV": btoa(String.fromCharCode(...checkdata_encrypt.iv)),
				"TAG": btoa(String.fromCharCode(...checkdata_encrypt.tag))
			})
		});
		const checkdata_result = await checkdata_ajax.json();
		if (!checkdata_result.STATUS) throw new Error("エラー");

		window.location.reload();
	}
}