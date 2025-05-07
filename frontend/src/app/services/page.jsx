import Link from "next/link";

export default function About() {
  return (
    <div className="container">
      <h2 className="text-center my-5">About Our AI-Powered Store</h2>
      <div className="row">
        <div className="col-md-6">
          <p>We use AI to recommend the best products for you.</p>
        </div>
        <div className="col-md-6">
          <p>Our goal is to provide seamless shopping experiences.</p>
        </div>
      </div>
      <div className="text-center my-4">
        <Link href="/" className="btn btn-outline-primary">Back to Home</Link>
      </div>
    </div>
  );
}
