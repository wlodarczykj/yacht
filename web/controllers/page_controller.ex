defmodule Yacht.PageController do
  use Yacht.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
