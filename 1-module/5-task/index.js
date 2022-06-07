const truncate = (str, maxlength) =>
    str.length > maxlength ? str.slice(0, maxlength - 1) + "…" : str

