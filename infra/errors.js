export class InternalServerError extends Error {
  constructor({ cause }) {
    super("Um erro interno não esperado aconteceu.", {
      cause,
    });
    this.name = "InterSeverError";
    this.action = "Entre em contato com o suporte";
    this.StatusCode = 500;
  }

  taJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.StatusCode,
    };
  }
}
