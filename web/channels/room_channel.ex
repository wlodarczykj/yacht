defmodule Yacht.RoomChannel do
  use Phoenix.Channel
  import Yacht.ChannelHelper

  def join("room:lobby", _message, socket) do
    {:ok, socket}
  end

  def join("room:" <> _private_room_id, _params, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_in("drawline", %{"from" => %{"x" => fromX, "y" => fromY}, "to" => %{"x" => toX, "y" => toY}, "color" => color}, socket) do
    broadcast! socket, "drawline", %{"from"=> %{"x" => fromX, "y" => fromY}, "to" => %{"x" => toX, "y" => toY}, "color" => color}
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

  def handle_in("userJoined", %{"name" => username}, socket) do
    insert_user username
    broadcast! socket, "userJoined", %{}
    {:noreply, socket}
  end
end
