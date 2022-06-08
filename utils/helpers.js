var path = require('path');

module.exports = {
    get_image_url: (file) => {
     
      // Format date as MM/DD/YYYY
      return date.toLocaleDateString();
    },
    get_profit_total: (file) => {
      let profitTotal = 0;
      for (let i = 0; i < file.length; i++) {
        let profit = file[i].downloads.length * file[i].price;
        profitTotal = profitTotal + profit;
      }
      return profitTotal;
    },
    get_downloads_total: (file) => {
      let downloadsTotal = 0;
      for (let i = 0; i < file.length; i++) {
        let downloads = file[i].downloads.length;
        downloadsTotal = downloadsTotal + downloads;
      }
      return downloadsTotal;
    },
    get_rating_average: (file) => {
      let ratingTotal = 0;
      let ratingLength = 1
      if (file.length == 0) {
        return 0;
      }
      for (let i = 0; i < file.length; i++) {
        for (let r = 0; r < file[i].reviews.length; r++ ) {
          if(file[i].reviews[r].rating)
          {
            let rating = file[i].reviews[r].rating;
            ratingTotal = ratingTotal + rating;
          }
          
          ratingLength++;
        }
      }
      
      return ratingTotal/ratingLength;

    } 
    
  };