import './Scrollable.css';

import React, {
  createRef as createReference,
  PureComponent,
  RefObject as ReferenceObject,
} from 'react';
import uniqid from 'uniqid';

interface ScrollableProps {
  breeds: string[];
}

interface ScrollableState {
  breeds: string[];
  finished: boolean;
  loading: boolean;
}

class Scrollable extends PureComponent<ScrollableProps, ScrollableState> {
  private readonly MAX_LIMIT: number = 13;

  private readonly containerReference: ReferenceObject<
    HTMLDivElement
  > = createReference<HTMLDivElement>();

  private currentCount: number = 0;

  public constructor(properties: ScrollableProps) {
    super(properties);
    this.state = {
      breeds: [],
      finished: false,
      loading: false,
    };
  }

  public componentDidMount(): void {
    if (this.containerReference.current !== null) {
      this.containerReference.current.addEventListener(
        'scroll',
        this.onScrollHandler,
      );
      this.setState({ loading: true });
      this.loadMoreImages(0, this.MAX_LIMIT);
    }
  }

  public componentWillUnmount(): void {
    if (this.containerReference.current !== null) {
      this.containerReference.current.removeEventListener(
        'scroll',
        this.onScrollHandler,
      );
    }

    this.currentCount = 0;
  }

  public render(): React.ReactNode {
    const { breeds, finished, loading } = this.state;

    return (
      <React.Fragment>
        <div className="container-full w-full py-2 border-gray-600 px-2">
          <div className="mx-1 scrollable" ref={this.containerReference}>
            <div className="grid grid-rows-auto grid-cols-3 gap-4">
              {breeds.map(
                (breedUrl: string): React.ReactNode => (
                  <React.Fragment key={uniqid()}>
                    <div className="border border-gray-800 shadow">
                      <img
                        src={breedUrl}
                        alt="breeds"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </React.Fragment>
                ),
              )}
            </div>
          </div>
          <div className="flex flex-col justify-center items-center my-3">
            {loading === true ? (
              <span className="text-xl font-bold text-white">Loading...</span>
            ) : null}

            {finished === true ? (
              <h1 className="text-sm text-white text-center w-6/12">
                Hope you enjoyed the gallery show! why don't you upload an
                another breed
              </h1>
            ) : null}
          </div>
        </div>
      </React.Fragment>
    );
  }

  private readonly loadMoreImages = (offset: number, size: number): void => {
    const temporary: string[] = [];

    for (let idx = offset; idx < offset + size; idx++) {
      if (this.props.breeds[idx] !== undefined)
        temporary.push(this.props.breeds[idx]);
    }

    this.setState({
      breeds: [...this.state.breeds, ...temporary],
      loading: false,
    });
  };

  private readonly onScrollHandler = (): void => {
    if (
      this.containerReference.current !== null &&
      this.containerReference.current.scrollTop +
        this.containerReference.current.clientHeight >=
        this.containerReference.current.scrollHeight
    ) {
      if (this.state.loading === false && this.state.finished === false) {
        if (this.state.breeds.length >= this.props.breeds.length) {
          this.setState({
            finished: true,
            loading: false,
          });
        } else {
          this.currentCount += 13;
          // SetTimeout is just to give a feel that the data is being fetched from rest api endpoint for this demo
          this.setState({ loading: true }, (): unknown =>
            setTimeout(
              (): void =>
                this.loadMoreImages(this.currentCount, this.MAX_LIMIT),
              Math.random() * 1000,
            ),
          );
        }
      }
    }
  };
}

export default Scrollable;
