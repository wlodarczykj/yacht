defmodule Yacht.RoomChannel do
  use Phoenix.Channel

  def join("room:lobby", _message, socket) do
    {:ok, socket}
  end

  def join("room:" <> _private_room_id, _params, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_in("drawline", %{"from" => %{"x" => fromX, "y" => fromY}, "to" => %{"x" => toX, "y" => toY}}, socket) do
    broadcast! socket, "drawline", %{"from"=> %{"x" => fromX, "y" => fromY}, "to" => %{"x" => toX, "y" => toY}}
    {:noreply, socket}
  end

  def handle_in("clear", %{}, socket) do
    broadcast! socket, "clear", %{}
    {:noreply, socket}
  end

  def handle_in("mousemove", %{"name" => username, "position" => %{"x" => x, "y" => y}}, socket) do
    broadcast! socket, "mousemove", %{"name" => username, "position" => %{"x" => x, "y" => y}}
    {:noreply, socket}
  end

  def handle_in("userJoined", %{"username" => username}, socket) do
    user = Repo.get!(User)
    broadcast! socket, "userJoined", %{"user" => user}
    {:noreply, socket}
  end
end
