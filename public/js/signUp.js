const signupFormHandler = async (event) => {
    event.preventDefault();
  
    const first_name = document.querySelector('.first-input').value.trim();
    const last_name = document.querySelector('.last-input').value.trim();
    const email = document.querySelector('.email-input').value.trim();
    const user_bio = document.querySelector('.bio-input').value.trim();
    const password = document.querySelector('.password-input').value.trim();
  
    if (first_name && last_name && email&&password) {
      const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({ first_name,last_name, email, password, user_bio }),
        headers: { 'Content-Type': 'application/json' },
      });
 
      if (response.ok) {
        document.location.replace('/');
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
    .addEventListener('submit', signupFormHandler);
  