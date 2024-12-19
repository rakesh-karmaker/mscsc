const ContactForm = () => {
  // const apiKey = process.env.REACT_APP_WEB3FORM_API_KEY;
  const apiKey = import.meta.VITE_WEB3FORM_API_KEY;

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    formData.append(apiKey, "YOUR_ACCESS_KEY_HERE");

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: json,
    }).then((res) => res.json());

    if (res.success) {
      console.log("Success", res);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="name-email">
        <input type="text" name="name" placeholder="Name" required />
        <input type="email" name="email" placeholder="Email" required />
      </div>

      <input type="text" name="subject" placeholder="Subject" required />
      <textarea
        name="message"
        placeholder="Write your message"
        required
      ></textarea>

      {/* <!-- Honeypot Spam Protection --> */}
      <input type="checkbox" name="botcheck" className="hidden" />

      <button type="submit" className="primary-button">
        Send the message
      </button>
    </form>
  );
};

export default ContactForm;
