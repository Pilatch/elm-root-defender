module Main exposing (main)

import Browser exposing (document)
import Html


main =
    document
        { init = \() -> ( 0, Cmd.none )
        , view = \model -> { title = "test", body = [ Html.text "Hello world." ] }
        , update = \msg model -> ( 9, Cmd.none )
        , subscriptions = \model -> Sub.none
        }
