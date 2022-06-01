const downloadHandler = async (event) => {
  event.preventDefault();

  const file_id = event.target.getAttribute("data-id");
  const url = event.target.getAttribute("data-url");
  const price = event.target.getAttribute("data-price");

  if (file_id && price) {
    const response = await fetch("/api/download", {
      method: "POST",
      body: JSON.stringify({ file_id, price }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      const a = document.createElement("a");
      a.href = url;
      a.download = url.split("/").pop();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      location.reload();
    } else {
      alert(response.statusText);
    }
  } else {
    alert("Fill all the fields!");
  }
};
const favouriteHandler = async (event) => {
  event.preventDefault();

  const file_id = event.target.getAttribute("data-id");

  if (file_id) {
    const rating = 5;
    const response = await fetch("/api/favourite", {
      method: "POST",
      body: JSON.stringify({ file_id, rating }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      alert("Successfully added into favourite book!");
    } else {
      alert("Fill all the fields!");
    }
  }
};

document
  .querySelector("#btndownload")
  .addEventListener("click", downloadHandler);
document
  .querySelector("#btnfavourite")
  .addEventListener("click", favouriteHandler);
