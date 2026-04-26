export function base64_decode(base64: string): Uint8Array {
	const binary_string = atob(base64);
	const binary = new Uint8Array(binary_string.length);
	for (let i = 0; i < binary_string.length; i++) {
		binary[i] = binary_string.charCodeAt(i);
	}
	return binary;
}