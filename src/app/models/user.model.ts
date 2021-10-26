export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}

// omitimos el id ya que no queremos enviarlo
export interface CreateUserDTO extends Omit<User, 'id'> {}
