const reviewFormHandler = async (event) => {
    event.preventDefault();
  
    const review_content = document.querySelector('.bio-input').value.trim();
    const rating = document.querySelector('#stars').value.trim();
    const file_id = document.querySelector('#file_id').value.trim();
   
    if (review_content && rating && file_id) {
      const response = await fetch('/api/review', {
        method: 'POST',
        body: JSON.stringify({ review_content,rating, file_id }),
        headers: { 'Content-Type': 'application/json' },
      });
 
      if (response.ok) {
        document.location.replace('/file/'+file_id);
      } else {
        alert(response.statusText);
      }
    }
    else{
        alert("Fill all the fields!"); 
      }
  };
  
 
  document
    .querySelector('.filters-form')
    .addEventListener('submit', reviewFormHandler);
  