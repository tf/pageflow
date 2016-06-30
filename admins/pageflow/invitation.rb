module Pageflow
  ActiveAdmin.register Invitation, as: 'Invitation' do
    menu false

    actions :new, :create, :edit, :update, :destroy

    form partial: 'admin/memberships/form'

    breadcrumb do
      if params[:account_id].present?
        [
          link_to('admin', admin_root_path),
          link_to(I18n.t('pageflow.admin.accounts.other'), admin_accounts_path),
          link_to(Account.find(params[:account_id]).name, admin_account_path(params[:account_id])),
          link_to(I18n.t('pageflow.admin.invitations.other'), admin_invitations_path)
        ]
      elsif params[:user_id].present?
        [
          link_to('admin', admin_root_path),
          link_to(I18n.t('pageflow.admin.users.other'), admin_users_path),
          link_to(User.find(params[:user_id]).full_name, admin_user_path(params[:user_id])),
          link_to(I18n.t('pageflow.admin.invitations.other'), admin_invitations_path)
        ]
      else
        [
          link_to('admin', admin_root_path),
          link_to(I18n.t('pageflow.admin.entries.other'), admin_entries_path),
          link_to(Entry.find(params[:entry_id]).title, admin_entry_path(params[:entry_id])),
          link_to(I18n.t('pageflow.admin.invitations.other'), admin_invitations_path)
        ]
      end
    end

    controller do
      belongs_to :entry, parent_class: Pageflow::Entry, polymorphic: true
      belongs_to :account, parent_class: Pageflow::Account, polymorphic: true
      belongs_to :user, parent_class: User, polymorphic: true

      helper Pageflow::Admin::MembershipsHelper
      helper Pageflow::Admin::FormHelper

      def create_resource(invitation)
        if resource.first_name.blank?
          if params[:user_id]
            invitation_user = User.find(params[:user_id])
          else
            invitation_user = User.find(params[:invitation][:user_id])
          end
          resource.first_name = invitation_user.first_name
          resource.last_name = invitation_user.last_name
        end
        super
      end

      def index
        if params[:user_id].present?
          redirect_to admin_user_url(params[:user_id])
        elsif params[:entry_id].present?
          redirect_to admin_entry_url(params[:entry_id])
        else
          redirect_to admin_account_url(params[:account_id])
        end
      end

      def create
        if params[:invitation][:entity_type] == 'Pageflow::Account'
          params.merge!(entity_type: :accounts)
        else
          params.merge!(entity_type: :entries)
        end

        create! do
          if params[:user_id].present? &&
             authorized?(:redirect_to_user, User.find(params[:user_id]))
            admin_user_url(params[:user_id], tab: "#{params[:entity_type]}")
          elsif params[:user_id].present? && authorized?(:index, User.find(params[:user_id]))
            admin_users_url
          elsif params[:account_id].present? &&
                authorized?(:read, Account.find(params[:account_id]))
            admin_account_url(params[:account_id], tab: :users)
          elsif params[:account_id].present? && authorized?(:index, :accounts)
            admin_accounts_url
          elsif params[:entry_id].present?
            admin_entry_url(resource.entity)
          else
            admin_entries_url
          end
        end
      end

      def update
        if resource.entity_type == 'Pageflow::Account'
          params.merge!(entity_type: :accounts)
        else
          params.merge!(entity_type: :entries)
        end

        update! do
          if params[:user_id].present? && authorized?(:redirect_to_user, resource.user)
            admin_user_url(params[:user_id], tab: "#{params[:entity_type]}")
          elsif params[:user_id].present? && authorized?(:index, resource.user)
            admin_users_url
          elsif params[:account_id].present? &&
                authorized?(:read, Account.find(params[:account_id]))
            admin_account_url(params[:account_id], tab: :users)
          elsif params[:account_id].present? && authorized?(:index, :accounts)
            admin_accounts_url
          elsif params[:entry_id].present?
            admin_entry_url(resource.entity)
          else
            admin_entries_url
          end
        end
      end

      def destroy
        if resource.entity_type == 'Pageflow::Account'
          resource.entity.entry_invitations.where(user: resource.user).destroy_all
          params.merge!(entity_type: :accounts)
        else
          params.merge!(entity_type: :entries)
        end

        destroy! do
          if params[:user_id].present? && authorized?(:redirect_to_user, resource.user)
            admin_user_url(params[:user_id], tab: "#{params[:entity_type]}")
          elsif params[:user_id].present? && authorized?(:index, resource.user)
            admin_users_url
          elsif params[:account_id].present? &&
                authorized?(:read, Account.find(params[:account_id]))
            admin_account_url(params[:account_id], tab: :users)
          elsif params[:account_id].present? && authorized?(:index, :accounts)
            admin_accounts_url
          elsif params[:entry_id].present?
            admin_entry_url(resource.entity)
          else
            admin_entries_url
          end
        end
      end

      def permitted_params
        params.permit(invitation:
                        [:user_id, :entity_id, :entity_type, :role, :first_name, :last_name])
      end
    end
  end
end
