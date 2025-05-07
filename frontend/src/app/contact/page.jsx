import Link from "next/link";

export default function Contact() {
  return (
    <div className="container">
      <h2 className="text-center my-5">Contact Us</h2>
      <div className="row">
        <div className="col-md-6">
          <p>Email: support@ai-store.com</p>
          <p>Phone: +123 456 7890</p>
        </div>
        <div className="col-md-6">
          <input type="text" className="form-control mb-2" placeholder="Your Name" />
          <input type="email" className="form-control mb-2" placeholder="Your Email" />
          <textarea className="form-control mb-2" placeholder="Your Message"></textarea>
          <button className="btn btn-primary">Send</button>
        </div>
      </div>
      <div className="text-center my-4">
        <Link href="/" className="btn btn-outline-primary">Back to Home</Link>
      </div>
    </div>
  );
}
