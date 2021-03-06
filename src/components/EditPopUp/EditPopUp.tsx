import classNames from "classnames";
import { useEffect, useState } from "react";
import { editPost } from "../../api/api";
import { Post } from "../../types/Post";
import { Button } from "../Button";
import { PopUpOverlay } from "../PopUpOverlay";
import { ResultMessage } from "../ResultMessage";

type Props = {
  popUpDisplayHandler: (isDisplayed: boolean) => void;
  setPosts: (posts: Post[] | ((current: Post[]) => Post[])) => void;
  postData: Post;
}

export const EditPopUp: React.FC<Props> = ({
  popUpDisplayHandler,
  postData,
  setPosts,
}) => {
  const [title, setTitle] = useState(postData.title);
  const [text, setText] = useState(postData.text);
  const [image, setImage] = useState(postData.image);
  const [url, setUrl] = useState(postData.url);
  const [errorWasReceived, setErrorWasReceived] = useState(false);
  const [postWasChanged, setPostWasChanged] = useState(false);
  const [isHidden, SetIsHidden] = useState(true);
  const [buttonIsDisabled, setButtonIsDisabled] = useState(false);

  const changeVisibility = () => {
    SetIsHidden(current => !current);
  };

  useEffect(() => {
    setTimeout(changeVisibility, 0)
  }, []);

  const modifiedPost = {
    title,
    text,
    image,
    url,
  }

  const changeSelectedPost = (posts: Post[], response: Post) => {
    return posts.map(post => {
      if (post.id === response.id) {
        return { ...post, ...response };
      }

      return post;
    })
  }

  const hidePopUp = () => {
    popUpDisplayHandler(false);
  }

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setButtonIsDisabled(true);
    editPost(modifiedPost, postData.id)
      .then((response) => {
        setPosts(current => {
          return changeSelectedPost(current, response)
        });
        setPostWasChanged(true);
      })
      .catch(() => {
        setErrorWasReceived(true);
      });
  };

  return (
    <div className="EditPopUp">
      <PopUpOverlay
        hidePopUp={hidePopUp}
      />

      <form
        className={classNames(
          'EditPopUp__form',
          { 'EditPopUp__form--hidden' : isHidden }
        )}
        onSubmit={(event) => {
          submitHandler(event);
        }}
      >
        {errorWasReceived || postWasChanged ||
          <div className="EditPopUp__interface">
            <h2 className="EditPopUp__heading">
              Edit this post
            </h2>

            <input
              className="EditPopUp__input"
              type="text"
              value={title}
              onChange={(event => {
                setTitle(event.target.value)
              })}
              placeholder="enter english name"
              required
            />

            <input
              className="EditPopUp__input"
              type="text"
              value={text}
              onChange={(event => {
                setText(event.target.value)
              })}
              placeholder="enter latin name"
              required
            />

            <input
              className="EditPopUp__input"
              type="text"
              value={image}
              onChange={(event => {
                setImage(event.target.value)
              })}
              placeholder="add image url"
              required
            />

            <input
              className="EditPopUp__input"
              type="text"
              value={url}
              onChange={(event => {
                setUrl(event.target.value)
              })}
              placeholder="add article url"
              required
            />

            <div className="EditPopUp__buttons">
              <Button
                text="submit"
                isSubmit={true}
                isDisabled={buttonIsDisabled}
              />

              <Button
                text="cancel"
                isWhite={true}
                clickHandler={hidePopUp}
              />
            </div>
          </div>
        }

        <div className="EditPopUp__message">
          {errorWasReceived &&
            <ResultMessage
              hidePopUp={hidePopUp}
              itWasError={errorWasReceived}
            />
          }

          {postWasChanged &&
            <ResultMessage
              hidePopUp={hidePopUp}
              itWasError={errorWasReceived}
            />
          }
        </div>
      </form>
    </div>
  )
}
