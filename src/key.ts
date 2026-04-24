import { argon2id } from "hash-wasm";

const KDF_CONFIG = {
	//256MB
	memory_size: 256*1024,
	//反復回数
	iteration: 4,
	//並列度
	parallelism: 4,
	//出力鍵長(AES-GCM)
	hash_length: 32,
	//お塩
	salt_length: 32
};

export type Key = {
	key: Uint8Array,
	salt: Uint8Array
};

export type Encrypted = {
	data: Uint8Array,
	iv: Uint8Array,
	tag: Uint8Array
};

export function gen_salt() {
	return crypto.getRandomValues(new Uint8Array(KDF_CONFIG.salt_length));
}

export async function get_key(passcode: string, salt: Uint8Array): Promise<Key> {
	const passphrase = `${passcode}`;

	const key = await argon2id({
		password: passphrase,
		salt: salt,
		parallelism: KDF_CONFIG.parallelism,
		iterations: KDF_CONFIG.iteration,
		memorySize: KDF_CONFIG.memory_size,
		hashLength: KDF_CONFIG.hash_length,
		outputType: "binary"
	});

	return {
		key: key,
		salt: salt
	};
}

function to_array_buffer(data: Uint8Array): ArrayBuffer {
	return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer;
}

async function import_key(key: Uint8Array): Promise<CryptoKey> {
	return await crypto.subtle.importKey(
		"raw",
		to_array_buffer(key),
		{ name: "AES-GCM" },
		false,
		[ "encrypt", "decrypt" ]
	);
}

export async function encrypt(key: Uint8Array, plain: Uint8Array): Promise<Encrypted> {
	const iv = crypto.getRandomValues(new Uint8Array(12));

	const encrypted_and_tag = new Uint8Array(await crypto.subtle.encrypt(
		{
			name: "AES-GCM",
			iv: iv
		},
		await import_key(key),
		to_array_buffer(plain)
	));

	const encrypted = encrypted_and_tag.slice(0, -16);
	const tag = encrypted_and_tag.slice(-16);

	return {
		data: encrypted,
		iv: iv,
		tag: tag
	};
}

export async function decrypt(key: Uint8Array, encrypted: Encrypted): Promise<Uint8Array> {
	const encrypted_and_tag = new Uint8Array(encrypted.data.byteLength + encrypted.tag.byteLength);
	encrypted_and_tag.set(encrypted.data, 0);
	encrypted_and_tag.set(encrypted.tag, encrypted.data.byteLength);

	const decrypted = await crypto.subtle.decrypt(
		{
			name: "AES-GCM",
			iv: to_array_buffer(encrypted.iv)
		},
		await import_key(key),
		encrypted_and_tag
	);

	return new Uint8Array(decrypted);
}