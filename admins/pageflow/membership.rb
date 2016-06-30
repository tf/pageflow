module Pageflow
  ActiveAdmin.register Membership, as: 'Membership' do
    menu false

    actions :new, :create, :edit, :update, :destroy

    form partial: 'form'

    breadcrumb do
      if params[:account_id].present?
        [
          link_to('admin', admin_root_path),
          link_to(I18n.t('pageflow.admin.accounts.other'), admin_accounts_path),
          link_to(Account.find(params[:account_id]).name, admin_account_path(params[:account_id])),
          link_to(I18n.t('pageflow.admin.memberships.other'), admin_memberships_path)
        ]
      elsif params[:user_id].present?
        [
          link_to('admin', admin_root_path),
          link_to(I18n.t('pageflow.admin.users.other'), admin_users_path),
          link_to(User.find(params[:user_id]).full_name, admin_user_path(params[:user_id])),
          link_to(I18n.t('pageflow.admin.memberships.other'), admin_memberships_path)
        ]
      else
        [
          link_to('admin', admin_root_path),
          link_to(I18n.t('pageflow.admin.entries.other'), admin_entries_path),
          link_to(Entry.find(params[:entry_id]).title, admin_entry_path(params[:entry_id])),
          link_to(I18n.t('pageflow.admin.memberships.other'), admin_memberships_path)
        ]
      end
    end

    controller do
      belongs_to :entry, parent_class: Pageflow::Entry, polymorphic: true
      belongs_to :account, parent_class: Pageflow::Account, polymorphic: true
      belongs_to :user, parent_class: User, polymorphic: true

      helper Pageflow::Admin::MembershipsHelper
      helper Pageflow::Admin::FormHelper

      def index
        if params[:user_id].present?
          redirect_to admin_user_url(params[:user_id])
        elsif params[:entry_id].present?
          redirect_to admin_entry_url(params[:entry_id])
        else
          redirect_to admin_account_url(params[:account_id])
        end
      end

      def create_resource(membership)
        if membership.entity_type == 'Pageflow::Entry' &&
           membership.user.invited_accounts.include?(Entry.find(membership.entity_id).account)
          Invitation.create(user: membership.user,
                            entity_id: membership.entity_id,
                            entity_type: 'Pageflow::Entry',
                            first_name: membership.user.first_name,
                            last_name: membership.user.last_name,
                            role: membership.role).errors.inspect.to_s
        else
          super
        end
      end

      def destroy
        if resource.entity_type == 'Pageflow::Account'
          resource.entity.entry_memberships.where(user: resource.user).destroy_all
        end

        destroy! do
          if authorized?(:redirect_to_user, resource.user) && params[:user_id]
            admin_user_url(resource.user)
          elsif authorized?(:redirect_to_user, resource.user) && params[:entry_id]
            admin_entry_url(resource.entity)
          elsif params[:user_id] && authorized?(:index, resource.user)
            admin_users_url
          elsif params[:account_id]
            admin_accounts_url
          else
            admin_entries_url
          end
        end
      end

      def permitted_params
        params.permit(membership: [:user_id, :entity_id, :entity_type, :role])
      end
    end
  end
end
