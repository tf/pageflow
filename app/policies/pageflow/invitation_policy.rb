module Pageflow
  class InvitationPolicy
    class Scope
      include Pageflow::AdmissionPolicyScopeMixin

      private

      def table_name
        'pageflow_invitations'
      end
    end
    include Pageflow::AdmissionPolicyMixin

    private

    def create_admission_for_entry?
      if Pageflow.config.invitation_workflows
        @admission.user.invited_accounts.include?(@admission.entity.account)
      else
        false
      end
    end
  end
end
