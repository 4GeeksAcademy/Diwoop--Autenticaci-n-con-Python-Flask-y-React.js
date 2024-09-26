"""empty message

Revision ID: 8b9538281116
Revises: 7a797b583523
Create Date: 2024-09-26 11:11:35.350238

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8b9538281116'
down_revision = '7a797b583523'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('people', schema=None) as batch_op:
        batch_op.add_column(sa.Column('image_url', sa.String(length=500), nullable=True))

    with op.batch_alter_table('planet', schema=None) as batch_op:
        batch_op.add_column(sa.Column('image_url', sa.String(length=500), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('planet', schema=None) as batch_op:
        batch_op.drop_column('image_url')

    with op.batch_alter_table('people', schema=None) as batch_op:
        batch_op.drop_column('image_url')

    # ### end Alembic commands ###
