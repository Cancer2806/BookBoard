

const downloadHandler = async (event) => {
    event.preventDefault();
  
    const file_id =event.target.getAttribute("data-id");
    const url = event.target.getAttribute("data-url");
    const price = event.target.getAttribute("data-price");
   

    if (file_id && price) {
      const response = await fetch('/api/download', {
        method: 'POST',
        body: JSON.stringify({ file_id, price }),
        headers: { 'Content-Type': 'application/json' },
      });
 
      if (response.ok) {
        const a = document.createElement('a')
a.href = url
a.download = url.split('/').pop()
document.body.appendChild(a)
a.click()
document.body.removeChild(a)
      } else {
        alert(response.statusText);
      }
    }
    else{
        alert("Fill all the fields!"); 
      }
  };
  
 
  document
    .querySelector('#btndownload')
    .addEventListener('click', downloadHandler);
  