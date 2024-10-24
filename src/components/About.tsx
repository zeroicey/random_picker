interface Props {
  showAbout: Boolean;
  handleOutsideClick: (event: React.MouseEvent) => void;
}

export default function About({ showAbout, handleOutsideClick }: Props) {
  if (!showAbout) return null;
  else
    return (
      <div
        id="about-overlay"
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        onClick={handleOutsideClick}
      >
        <div className="bg-white p-5 rounded-lg shadow-lg max-w-md">
          <h2 className="text-xl font-bold mb-2">About This Project 🎉</h2>
          <p className="mb-2">
            The <strong>Random Name Picker</strong> is a web application
            designed to assist educators in randomly selecting names from a
            list.
          </p>
          <hr />
          <p className="mb-2">
            This project was created to help my English teacher randomly call on
            students during class, making activities more engaging and
            efficient. 📚✨
          </p>
          <h3 className="font-semibold mt-4">Author: 👤</h3>
          <p className="mb-2">zeroicey (happpy)</p>
          <h3 className="font-semibold">GitHub Repository: 🌐</h3>
          <p>
            Explore the source code and contribute on{" "}
            <a
              href="https://github.com/zeroicey/random_picker"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600"
            >
              GitHub
            </a>
            . 🛠️
          </p>
        </div>
      </div>
    );
}
