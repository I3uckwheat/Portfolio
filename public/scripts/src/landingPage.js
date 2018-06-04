const quote = document.getElementById('quote');

updateQuote(quote);

function updateQuote(element) {
  fetch('http://quotes.stormconsultancy.co.uk/random.json', {mode: 'cors'})
    .then(response => {
      return response.json();
    })
    .then(response => console.log(response))
    .catch(console.error);
}
