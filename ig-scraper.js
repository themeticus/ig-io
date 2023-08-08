// Select all H2 elements with class "listing-item-title"
const titleElements = document.querySelectorAll("h2.listing-item-title");

// Select all SPAN elements with class "listing-item-lowest-rate-currency-and-rate"
const priceElements = document.querySelectorAll("span.listing-item-lowest-rate-currency-and-rate");

// Select all SPAN elements with class "listing-item-category-in-location"
const categoryElements = document.querySelectorAll("span.listing-item-category-in-location");

// Create an array to store the found values
const resultsArray = [];

// Helper function to truncate the image URLs after ".jpg", ".jpeg", or ".png" extension
const truncateImageURL = (url) => {
  const extensionRegex = /\.(jpg|jpeg|png)/i;
  const extensionMatch = url.match(extensionRegex);
  
  if (extensionMatch) {
    const extension = extensionMatch[0].toLowerCase();
    url = url.replace(new RegExp(extension + ".*"), extension); // Remove everything after the extension
  }

  return url;
};

// Helper function to extract the number from the text
const extractNumber = (text) => {
  const numberRegex = /\d+/;
  const numberMatch = text.match(numberRegex);
  return numberMatch ? parseInt(numberMatch[0]) : 0;
};

// Helper function to extract "TYPE" and "LOCATION" from the Category value
const extractTypeAndLocation = (categoryValue) => {
  const index = categoryValue.indexOf(" in ");
  if (index !== -1) {
    return {
      TYPE: categoryValue.substring(0, index),
      LOCATION: categoryValue.substring(index + 4),
    };
  } else {
    return {
      TYPE: categoryValue,
      LOCATION: "N/A",
    };
  }
};

// Loop through the H2 elements and process their data
titleElements.forEach((element, index) => {
  const container = element.closest(".listing-item");
  const slideshowContainer = container ? container.querySelector(".react-slideshow-container") : null;
  const images = slideshowContainer ? slideshowContainer.querySelectorAll("img") : [];

  // Save the truncated image URLs to variables
  const coverImageURL = images.length >= 1 ? truncateImageURL(images[0].src) : "N/A";
  const contentImageURL = images.length >= 2 ? truncateImageURL(images[1].src) : "N/A";
  
  // Remove "R" and comma from the Price value
  const priceValue = priceElements[index].innerText.replace(/R|,/g, '');

  // Extract "TYPE" and "LOCATION" from the Category value
  const categoryValue = categoryElements[index].innerText;
  const { TYPE, LOCATION } = extractTypeAndLocation(categoryValue);

  // Extract the number of guests and bedrooms
  const icons = container ? container.querySelector(".listing-item-icons") : null;
  const iconItems = icons ? icons.querySelectorAll("li.listing-item-icon") : [];
  let numberOfGuests = 0;
  let numberOfBedrooms = 0;
  
  iconItems.forEach((iconItem) => {
    const iconText = iconItem.innerText.toLowerCase();
    if (iconText.includes("guest")) {
      numberOfGuests = extractNumber(iconText);
    } else if (iconText.includes("bedroom")) {
      numberOfBedrooms = extractNumber(iconText);
    }
  });

  // Check if the title contains a colon
  const titleParts = element.innerText.split(':');
  let title = titleParts[0].trim();
  let subTitle = titleParts.length > 1 ? titleParts.slice(1).join(':').trim() : "";

  const item = {
    Title: title,
    SubTitle: subTitle,
    Price: priceValue,
    Type: TYPE,
    Location: LOCATION,
    NumberOfGuests: numberOfGuests,
    NumberOfBedrooms: numberOfBedrooms,
    coverImage: coverImageURL,
    contentImage: contentImageURL,
  };
  resultsArray.push(item);
});

// Log the array as a table in the console
console.table(resultsArray);

// Convert the resultsArray to a JSON object
const resultsJSON = JSON.stringify(resultsArray);

// Log the JSON object to the console
console.log(resultsJSON);

// Now, you can use the resultsJSON object wherever you need a JSON representation of the data.