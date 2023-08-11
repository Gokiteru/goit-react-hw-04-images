import React, { Component } from 'react';
import Notiflix from 'notiflix';
import * as API from '../API';
import Button from './Button/Button';
import ImageGallery from './ImageGallery/ImageGallery';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';
import Searchbar from './Searchbar/Searchbar';

class App extends Component {
  state = {
    images: [],
    isLoading: false,
    error: null,
    query: '',
    page: 1,
    showModal: false,
    selectedImages: null,
    isLastPage: false,
    totalPages: 0,
  };

  componentDidUpdate(prevProps, prevState) {
    const { query, page } = this.state;
    const { query: prevQuery, page: prevPage } = prevState;

    if (query !== prevQuery || page !== prevPage) {
      this.fetchGallery();
    }
  }

  loadMore = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  fetchGallery = async () => {
    const { query, page } = this.state;

    try {
      this.setState({ isLoading: true });
      const data = await API.getGallery(query, page);

      if (data.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your request...'
        );
      }

      const optimizedGallery = API.optimizedGallery(data.hits);

      this.setState(prevState => ({
        images: [...prevState.images, ...optimizedGallery],
        isLastPage:
          prevState.images.lenght + optimizedGallery.lenght >= data.totalHits,
        error: null,
        totalPages: Math.ceil(data.totalHits / API.perPage),
      }));
    } catch (error) {
      this.setState({ error: error.message });
      Notiflix.Notify.failure('Sorry, something went wrong.');
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleSearchSubmit = query => {
    if (this.state.query === query) {
      return;
    }

    this.setState({
      query: query,
      page: 1,
      images: [],
      error: null,
      isLastPage: false,
    });
  };

  handleImageClick = image => {
    this.setState({
      selectedImages: image,
      showModal: true,
    });
  };

  handleModalClsoe = () => {
    this.setState({
      selectedImages: null,
      showModal: false,
    });
  };

  render() {
    const { images, isLoading, error, showModal, selectedImages, isLastPage } =
      this.state;

    return (
      <div>
        <Searchbar onSubmit={this.handleSearchSubmit} />
        {error && <p>Error: {error}</p>}

        <ImageGallery images={images} onItemClick={this.handleImageClick} />
        {isLoading && <Loader />}

        {!isLoading && images.length > 0 && !isLastPage && (
          <Button onClick={this.loadMore} />
        )}

        {showModal && (
          <Modal image={selectedImages} onClose={this.handleModalClsoe} />
        )}
      </div>
    );
  }
}

export default App;
