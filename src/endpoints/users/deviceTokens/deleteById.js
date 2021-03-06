import errors from 'restify-errors';

const deleteById = function deleteById(request, response) {
  const params = request.params;

  return Promise.resolve().then(() => {
    const { userId, id } = params;

    if (!userId || typeof userId !== 'string') {
      throw new errors.BadRequestError('The userId parameter must be a string');
    }

    if (!id || typeof id !== 'string') {
      throw new errors.BadRequestError('The deviceTokenId parameter must be a string');
    }

    if (!request.userId) {
      throw new errors.UnauthorizedError('Cannot delete device token without authentication');
    }

    if (request.userId !== userId) {
      throw new errors.UnauthorizedError('The authenticated user is not authorized to delete this device token');
    }

    const deviceTokenQuery = {
      where: { id, userId }
    };

    return this.database.deviceToken.destroy(deviceTokenQuery).then(() => {
      response.send(204);
    });
  });
};

export default deleteById;
