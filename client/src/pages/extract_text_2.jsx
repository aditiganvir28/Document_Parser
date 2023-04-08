import React from 'react';

function RegexDisplay() {
  // Sample text to search for patterns
  const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vestibulum, mauris quis dictum sagittis, ipsum risus molestie sapien, non tincidunt risus nulla eget elit. Maecenas ultrices, turpis sit amet faucibus iaculis, metus libero venenatis risus, eu varius nisi sapien id metus. Fusce a semper nibh. Sed at velit eu metus tristique feugiat. Duis congue, lectus vel consectetur eleifend, purus arcu dapibus tellus, at vestibulum est lacus ut est. Quisque tempor magna velit, sit amet posuere magna malesuada vel. Vestibulum pulvinar nulla at velit lacinia, vel blandit nisl mattis. Praesent vel eros euismod, pellentesque sapien id, lobortis felis. Phasellus condimentum volutpat velit, sed venenatis augue tincidunt vel. Nunc ac lacus in nunc iaculis venenatis. Pellentesque quis porttitor elit. Email: john.doe@example.com. Phone: (123) 456-7890. Date: 2023-04-06. Credit card: 1234-5678-9012-3456.";

  // Regex patterns to search for email, phone, date, and credit card number
  const emailRegex = /([a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9._-]+)/g;
  const phoneRegex = /\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})/g;
  const dateRegex = /([0-9]{4}-[0-9]{2}-[0-9]{2})/g;
  const creditCardRegex = /([0-9]{4}-){3}[0-9]{4}/g;

  // Extract patterns using regex
  const emails = text.match(emailRegex);
  const phones = text.match(phoneRegex);
  const dates = text.match(dateRegex);
  const creditCards = text.match(creditCardRegex);

  // Render the extracted patterns
  return (
    <div>
      <h1>Emails:</h1>
      <ul>
        {emails.map((email, index) => (
          <li key={index}>{email}</li>
        ))}
      </ul>
      <h1>Phone Numbers:</h1>
      <ul>
        {phones.map((phone, index) => (
          <li key={index}>{phone}</li>
        ))}
      </ul>
      <h1>Dates:</h1>
      <ul>
        {dates.map((date, index) => (
          <li key={index}>{date}</li>
        ))}
      </ul>
      <h1>Credit Card Numbers:</h1>
      <ul>
        {creditCards.map((creditCard, index) => (
          <li key={index}>{creditCard}</li>
        ))}
      </ul>
    </div>
  );
}

export default RegexDisplay;