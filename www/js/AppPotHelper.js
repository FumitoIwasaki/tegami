function nullToBlank(str) {
    return str == null ? "" : str;
}

function throwErrorIfErrorStatus (response) {
	if (response.data.status === "error") {
//    console.error(response.data.description);
//    alert(response.data.description);
		var error = new Error(response.data.description);
		error.code = response.data.errCode;
		throw error;
	}
}