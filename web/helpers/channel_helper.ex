defmodule Yacht.ChannelHelper do
  alias Yacht.User
  alias Yacht.Repo
  
  def insert_user(username) do
    changeset = User.changeset(%User{}, %{"name" => username, "color" => "0,0,0"})
    Repo.insert(changeset)
  end
end
