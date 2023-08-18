import React, { useState, useEffect } from 'react';
import Notiflix from 'notiflix';
import * as API from '../API';
import Button from './Button/Button';
import ImageGallery from './ImageGallery/ImageGallery';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';
import Searchbar from './Searchbar/Searchbar';

function App() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [totalHits, setTotalHits] = useState(0);

  useEffect(() => {
    const fetchGallery = async () => {
      if (query !== '') {
        try {
          setIsLoading(true);
          const data = await API.getGallery(query, page);

          if (data.hits.length === 0) {
            Notiflix.Notify.failure(
              'Sorry, there are no images matching your request...'
            );
          }

          const optimizedGallery = API.optimizedGallery(data.hits);

          setImages(prevImages => [...prevImages, ...optimizedGallery]);
          setTotalHits(data.totalHits);
          setError(null);
        } catch (error) {
          setError(error.message);
          Notiflix.Notify.failure('Sorry, something went wrong.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchGallery();
  }, [query, page]);

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleSearchSubmit = newQuery => {
    if (query === newQuery) {
      return;
    }

    setQuery(newQuery);
    setPage(1);
    setImages([]);
    setError(null);
    setTotalHits(0);
  };

  const handleImageClick = image => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setSelectedImage(null);
    setShowModal(false);
  };

  return (
    <div>
      <Searchbar onSubmit={handleSearchSubmit} />
      {error && <p>Error: {error}</p>}

      <ImageGallery images={images} onItemClick={handleImageClick} />
      {isLoading && <Loader />}

      {!isLoading && images.length > 0 && images.length < totalHits && (
        <Button onClick={loadMore} />
      )}

      {showModal && <Modal image={selectedImage} onClose={handleModalClose} />}
    </div>
  );
}

export default App;

