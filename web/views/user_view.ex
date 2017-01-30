defmodule Yacht.UserView do
  use Yacht.Web, :view

  def render("index.json", %{users: users}) do
    %{
      users: Enum.map(users, &user_json/1)
    }
  end

  def user_json(user) do
    %{
      name: user.name,
      color: user.color,
      inserted_at: user.inserted_at
    }
  end
end
