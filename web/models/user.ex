defmodule Yacht.User do
  use Yacht.Web, :model

  schema "users" do
    field :name, :string
    field :color, :string

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name, :color])
    |> validate_required([:name, :color])
  end
end
