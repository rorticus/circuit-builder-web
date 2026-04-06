// Direct localStorage bridge for WASM
function _storage_utf8(ptr, len) {
    return new TextDecoder().decode(new Uint8Array(wasm_memory.buffer, ptr, len));
}

register_js_storage = function(importObject) {
    importObject.env.js_storage_get = function(key_ptr, key_len, out_ptr, out_max) {
        var key = _storage_utf8(key_ptr, key_len);
        var value = localStorage.getItem(key);
        if (value === null) return -1;
        var encoded = new TextEncoder().encode(value);
        if (encoded.length > out_max) return -1;
        new Uint8Array(wasm_memory.buffer).set(encoded, out_ptr);
        return encoded.length;
    };
    importObject.env.js_storage_set = function(key_ptr, key_len, val_ptr, val_len) {
        localStorage.setItem(_storage_utf8(key_ptr, key_len), _storage_utf8(val_ptr, val_len));
    };
};

miniquad_add_plugin({
    register_plugin: register_js_storage,
    on_init: function() {},
    name: "js_storage",
    version: "0.1.0"
});
